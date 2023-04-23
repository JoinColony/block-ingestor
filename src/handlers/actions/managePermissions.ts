import { mutate, query } from '~amplifyClient';
import { ContractEvent, ContractEventsSignatures } from '~types';
import {
  getColonyRolesDatabaseId,
  createInitialColonyRolesDatabaseEntry,
  createColonyHistoricRoleDatabaseEntry,
  verbose,
} from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { args, contractAddress, blockNumber, signature, transactionHash } = event;
  const { user, domainId, role, setTo } = args;

  const id = getColonyRolesDatabaseId(contractAddress, domainId.toString(), user);
  const roleValue = {
    /*
     * Set it back to null rather than false, for consistency
     *
     * @NOTE This is the only place where there's actually any logic to handle `RecoveryRoleSet`
     * This is since the `roleValue` const is only used when updating, as when creating
     * a entry from scratch we bypass events and test each role individually
     */
    [`role_${signature === ContractEventsSignatures.RecoveryRoleSet ? 0 : role}`]: setTo || null,
  };

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
     */
    if (blockNumber > parseInt(existingColonyRoleLatestBlock, 10)) {
      await mutate('updateColonyRole', {
        input: {
          id,
          latestBlock: blockNumber,
          ...roleValue,
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
          ...roleValue,
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
