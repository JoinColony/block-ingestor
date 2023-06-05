import { BigNumber } from 'ethers';
import { mutate, query } from '~amplifyClient';
import { ContractEvent, ColonyActionType } from '~types';
import {
  getColonyRolesDatabaseId,
  getDomainDatabaseId,
  createInitialColonyRolesDatabaseEntry,
  createColonyHistoricRoleDatabaseEntry,
  getAllRoleEventsFromTransaction,
  getRolesMapFromEvents,
  verbose,
  writeActionFromEvent,
} from '~utils';
import {
  GetColonyRoleQuery,
  GetColonyRoleQueryVariables,
  GetColonyRoleDocument,
  UpdateColonyRoleMutation,
  UpdateColonyRoleMutationVariables,
  UpdateColonyRoleDocument,
} from '~graphql';

export default async (event: ContractEvent): Promise<void> => {
  const { args, contractAddress, blockNumber, transactionHash } = event;
  const {
    agent,
    user: targetAddress,
    /*
     * RecoveryRoleSet doesn't have a `domainId` value inside the it's event args
     * since it can only be emmitted in the Root domain, so for such cases, we
     * default to the Root Domain
     */
    domainId = BigNumber.from(1),
  } = args;

  const id = getColonyRolesDatabaseId(
    contractAddress,
    domainId.toString(),
    targetAddress,
  );
  const domainDatabaseId = getDomainDatabaseId(
    contractAddress,
    domainId.toString(),
  );

  const {
    id: existingColonyRoleId,
    latestBlock: existingColonyRoleLatestBlock = 0,
    /*
     * We need to extract __typename since the `existingRoles` object will get
     * Passed down to another mutation and typenames will clash
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __typename,
    ...existingRoles
  } = (
    await query<GetColonyRoleQuery, GetColonyRoleQueryVariables>(
      GetColonyRoleDocument,
      { id },
    )
  )?.data?.getColonyRole ?? {};

  /*
   * update the entry
   */
  if (existingColonyRoleId) {
    /*
     * Only update the entry if the event we're processing is older than the latest
     * permissions we stored in the database
     *
     * Would be ideal if we could tell if the previous mutation executed, because as it stands,
     * until it finishes, this logic check can't really tell and will try to execute it again
     *
     * (it doesn't break anything, as the GraphQL server will just discard it with an error,
     * but it just adds more travel time which is wasted)
     */
    if (blockNumber > existingColonyRoleLatestBlock) {
      const allRoleEventsUpdates = await getAllRoleEventsFromTransaction(
        transactionHash,
        contractAddress,
      );
      const rolesFromAllUpdateEvents =
        getRolesMapFromEvents(allRoleEventsUpdates);
      const rolesFromAllUpdateEventsForAction = getRolesMapFromEvents(
        allRoleEventsUpdates,
        false,
      );

      await mutate<UpdateColonyRoleMutation, UpdateColonyRoleMutationVariables>(
        UpdateColonyRoleDocument,
        {
          input: {
            id,
            latestBlock: blockNumber,
            ...rolesFromAllUpdateEvents,
          },
        },
      );

      verbose(
        `Update the Roles entry for ${targetAddress} in colony ${contractAddress}, under domain ${domainId.toNumber()}`,
      );

      /*
       * Create the historic role entry
       */
      await createColonyHistoricRoleDatabaseEntry(
        contractAddress,
        domainId.toNumber(),
        targetAddress,
        blockNumber,
        {
          ...existingRoles,
          ...rolesFromAllUpdateEvents,
        },
      );

      /*
       * Create the action
       */
      await writeActionFromEvent(event, contractAddress, {
        type: ColonyActionType.SetUserRoles,
        fromDomainId: domainDatabaseId,
        initiatorAddress: agent,
        recipientAddress: targetAddress,
        roles: {
          ...rolesFromAllUpdateEventsForAction,
        },
        individualEvents: JSON.stringify(
          allRoleEventsUpdates.map(
            ({ name, args: { role, setTo }, transactionHash, logIndex }) => ({
              id: `${transactionHash}_${logIndex}`,
              type: name,
              role,
              setTo,
            }),
          ),
        ),
      });
    }
    /*
     * create a new entry
     */
  } else {
    /*
     * @NOTE We might not start at the correct initial permissions state just going by events
     * (ie: first event captured by the ingestor is actually not the first for this user)
     *
     * For that, if we have to create the entry from scratch we ensure we have the correct
     * state by fetching it from the chain
     *
     * This encapsulates:
     * - creating a new role entry
     * - creating a new historic role entry (log)
     * - creating the action entry
     */

    await createInitialColonyRolesDatabaseEntry(
      contractAddress,
      domainId.toNumber(),
      targetAddress,
      transactionHash,
    );
  }
};
