import { mutate, query } from '~amplifyClient';
import { ContractEvent, ContractEventsSignatures } from '~types';
import {
  getColonyRolesDatabaseId,
  createInitialColonyRolesDatabaseEntry,
} from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { args, contractAddress, blockNumber, signature } = event;
  const { agent, user, domainId, role, setTo } = args;

  const id = getColonyRolesDatabaseId(contractAddress, domainId.toString(), user);
  const roleValue = {
    /* set it back to null rather than false, for consistency */
    [`role_${signature === ContractEventsSignatures.RecoveryRoleSet ? 0 : role}`]: setTo || null,
  };

  /*
   * @TODO
   * - create action list entry
   * - handle individual recovery role being set
   */

  const {
    id: existingColonyRoleId,
    latestBlock: existingColonyRoleLatestBlock,
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
      console.log('update entry for', contractAddress, user, domainId.toString(), 'role', role, setTo);
      await mutate('updateColonyRole', {
        input: {
          id,
          latestBlock: blockNumber,
          ...roleValue,
        },
      });
    }
  /*
   * create a new entry
   */
  } else {
    console.log('create new entry for', contractAddress, user, domainId.toString(), 'role', role, setTo);

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

  /*
   * If the agent is the actual network contract, DON'T expose the action
   * This will only happed the first time colony is created
   *
   * @NOTE That for the old version of the event:
   * ColonyRoleSet(indexed address,indexed uint256,indexed uint8,bool)
   * We won't have a agent value (that's just how it was created originally) meaning
   * we can't know who created the call (easily, anyways), in which case `agent` will
   * be set to undefined, so this check will pass, and the actions entry to set
   * permissions will be created
   */
  if (agent !== process.env.CHAIN_NETWORK_CONTRACT) {
    // console.log('Role was set by the network contract');
    // await writeActionFromEvent(event, colonyAddress, {
    //   type: ColonyActionType.CreateDomain,
    //   fromDomainId: databaseDomainId,
    //   initiatorAddress,
    // });
  }
};
