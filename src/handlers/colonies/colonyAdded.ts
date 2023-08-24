import { mutate } from '~amplifyClient';
import { setupListenersForColony } from '~eventListeners';
import {
  UpdateColonyContributorDocument,
  UpdateColonyContributorMutation,
  UpdateColonyContributorMutationVariables,
} from '~graphql';
import { coloniesSet } from '~stats';
import { ContractEvent, ContractEventsSignatures } from '~types';
import {
  output,
  updateStats,
  createColonyFounderInitialRoleEntry,
  getAllRoleEventsFromTransaction,
} from '~utils';
import { getColonyContributorId } from '~utils/contributors';

export default async (event: ContractEvent): Promise<void> => {
  const { transactionHash, args } = event;
  const { colonyAddress, token: tokenAddress } = args ?? {};
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

  const events = await getAllRoleEventsFromTransaction(
    transactionHash,
    colonyAddress,
  );

  const ColonyRoleSetEventName = ContractEventsSignatures.ColonyRoleSet.slice(
    0,
    ContractEventsSignatures.ColonyRoleSet.indexOf('('),
  );

  const {
    args: { user: colonyFounderAddress },
  } = events.find((event) => event?.name === ColonyRoleSetEventName) ?? {
    args: { user: '' },
  };

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

  await createColonyFounderInitialRoleEntry(event, colonyFounderAddress);

  /*
   * A new contributor is created when assigned permissions, so just update the watched status of the colony founder.
   * I'm doing this here to avoid a race condition with the front end. It's simpler to perform an update here than to
   * check whether the contributor has already been created in the front end, and perform an update or a create mutation
   * accordingly.
   */
  await mutate<
    UpdateColonyContributorMutation,
    UpdateColonyContributorMutationVariables
  >(UpdateColonyContributorDocument, {
    input: {
      id: getColonyContributorId(colonyAddress, colonyFounderAddress),
      isWatching: true,
    },
  });

  /*
   * Setup all Colony specific listeners for it
   */
  setupListenersForColony(colonyAddress);
};
