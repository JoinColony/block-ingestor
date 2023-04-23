import { mutate, query } from '~amplifyClient';
import { ContractEvent } from '~types';
import {
  getColonyRolesDatabaseId,
  createInitialColonyRolesDatabaseEntry,
  createColonyHistoricRoleDatabaseEntry,
  getAllRoleEventsFromTransaction,
  getRolesMapFromEvents,
  verbose,
} from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { args, contractAddress, blockNumber, transactionHash } = event;
  const { user, domainId } = args;

  const id = getColonyRolesDatabaseId(contractAddress, domainId.toString(), user);

  /*
   * @TODO
   * - create action list entry
   */

  const {
    id: existingColonyRoleId,
    latestBlock: existingColonyRoleLatestBlock,
    ...existingRoles
  } = (await query('getColonyRole', { id })) || {};

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
    if (blockNumber > parseInt(existingColonyRoleLatestBlock, 10)) {
      console.log(blockNumber, parseInt(existingColonyRoleLatestBlock, 10))
      const allRoleEventsUpdates = await getAllRoleEventsFromTransaction(transactionHash, contractAddress);
      const rolesFromAllUpdateEvents = getRolesMapFromEvents(allRoleEventsUpdates);

      await mutate('updateColonyRole', {
        input: {
          id,
          latestBlock: blockNumber,
          ...rolesFromAllUpdateEvents,
        },
      });

      verbose(
        `Update the Roles entry for user ${user} in colony ${contractAddress}, under domain ${domainId.toNumber()}`,
      );

      /*
       * Create the historic role entry
       */
      await createColonyHistoricRoleDatabaseEntry(
        contractAddress,
        domainId.toNumber(),
        user,
        blockNumber,
        {
          ...existingRoles,
          ...rolesFromAllUpdateEvents,
        },
      );
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
     */

    await createInitialColonyRolesDatabaseEntry(
      contractAddress,
      domainId.toNumber(),
      user,
      blockNumber,
    );
  }

  // Create the action entry
  //
  // await writeActionFromEvent(event, colonyAddress, {
  //   type: ColonyActionType.CreateDomain,
  //   fromDomainId: databaseDomainId,
  //   initiatorAddress,
  // });
  console.log(transactionHash)
};
