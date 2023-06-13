import { setupListenersForColony } from '~eventListeners';
import { coloniesSet } from '~trackColonies';
import { ContractEvent } from '~types';
import {
  output,
  updateStats,
  createColonyFounderInitialRoleEntry,
} from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { colonyAddress, token: tokenAddress } = event.args ?? {};

  /*
   * Add it to the Set
   */
  coloniesSet.add(JSON.stringify({ colonyAddress, tokenAddress }));
  await updateStats({ trackedColonies: coloniesSet.size });

  output(
    'Found new Colony:',
    colonyAddress,
    'Total tracked colonies:',
    coloniesSet.size,
  );

  /*
   * @NOTE This needs to called manually in here, as opposed to the handler
   * since all the role set events (5 ColonyRoleSets + 1 RecoverRoleSet) get emmited
   * in the same block with all the other colony creation events.
   *
   * This means that by the time the current `ColonyAdded` handler gets picked up
   * those Role events already got emmited, and there wasn't any event listener to
   * pick them up.
   *
   * If we don't have this in here, we'll need to wait for the next time the block
   * ingestor gets restarted for the role entries to be created.
   *
   * This will make it so that in production, a colony will be essentially broken
   * (from a permissions standpoint) until the block ingestor restarts, which,
   * if all goes well, might be a while...
   */
  await createColonyFounderInitialRoleEntry(event);

  /*
   * Setup all Colony specific listeners for it
   */
  setupListenersForColony(colonyAddress);
};
