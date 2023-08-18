import { BigNumber } from 'ethers';
import { Id } from '@colony/colony-js';
import { mutate, query } from '~amplifyClient';
import { ContractEvent } from '~types';
import {
  getColonyRolesDatabaseId,
  getDomainDatabaseId,
  createInitialColonyRolesDatabaseEntry,
  createColonyHistoricRoleDatabaseEntry,
  getAllRoleEventsFromTransaction,
  getRolesMapFromEvents,
  verbose,
  writeActionFromEvent,
  getExtensionInstallations,
} from '~utils';
import {
  GetColonyRoleQuery,
  GetColonyRoleQueryVariables,
  GetColonyRoleDocument,
  UpdateColonyRoleMutation,
  UpdateColonyRoleMutationVariables,
  UpdateColonyRoleDocument,
  ColonyActionType,
} from '~graphql';
import provider from '~provider';
import { updateColonyContributor } from '~utils/contributors';

export default async (event: ContractEvent): Promise<void> => {
  const {
    args,
    contractAddress: colonyAddress,
    blockNumber,
    transactionHash,
  } = event;
  const {
    user: targetAddress,
    /*
     * RecoveryRoleSet doesn't have a `domainId` value inside the it's event args
     * since it can only be emmitted in the Root domain, so for such cases, we
     * default to the Root Domain
     */
    domainId = BigNumber.from(Id.RootDomain),
  } = args;
  let { agent } = args;

  const id = getColonyRolesDatabaseId(
    colonyAddress,
    domainId.toString(),
    targetAddress,
  );
  const domainDatabaseId = getDomainDatabaseId(
    colonyAddress,
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
      // No agent means the recovery role was set and is the first to be processed in the block.
      // We can get the msg.sender from the transaction receipt.

      if (!agent) {
        const { from = '' } = await provider.getTransactionReceipt(
          transactionHash,
        );
        agent = from;
      }
      const allRoleEventsUpdates = await getAllRoleEventsFromTransaction(
        transactionHash,
        colonyAddress,
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
        `Update the Roles entry for ${targetAddress} in colony ${colonyAddress}, under domain ${domainId.toNumber()}`,
      );

      /*
       * Create the historic role entry
       */
      await createColonyHistoricRoleDatabaseEntry(
        colonyAddress,
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
      await writeActionFromEvent(event, colonyAddress, {
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
      colonyAddress,
      domainId.toNumber(),
      targetAddress,
      transactionHash,
    );
  }

  /*
   * Whenever a permission is added/removed, confirm that the target address still has at least one permission in the colony
   */

  const installedExtensions = new Set(
    await getExtensionInstallations(colonyAddress),
  );

  // We don't create contributor entries for extensions
  if (!installedExtensions.has(targetAddress))
    await updateColonyContributor({
      colonyAddress,
      contributorAddress: targetAddress,
    });
};
