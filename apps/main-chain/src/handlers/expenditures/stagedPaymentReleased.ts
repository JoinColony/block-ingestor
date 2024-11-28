import { utils } from 'ethers';
import { ExtensionEventListener } from '~eventListeners';
import { ColonyActionType } from '@joincolony/graphql';
import { getInterfaceByListener } from '~interfaces';
import provider from '~provider';
import { ContractEventsSignatures, EventHandler } from '~types';
import {
  checkActionExists,
  getCachedColonyClient,
  getExpenditureDatabaseId,
  mapLogToContractEvent,
  toNumber,
  writeActionFromEvent,
} from '~utils';

export const handleStagedPaymentReleased: EventHandler = async (
  event,
  listener,
) => {
  /**
   * @NOTE: The UI uses multicall to potentially release multiple slots in one transaction
   * Since we only want to create a single action, we will get all slot release events
   * the first time we see this event and skip the subsequent ones
   *
   * Something to refactor once https://github.com/JoinColony/colonyCDapp/issues/2317 is implemented
   */
  const { transactionHash, blockNumber } = event;
  const actionExists = await checkActionExists(transactionHash);
  if (actionExists) {
    return;
  }

  const { expenditureId, agent: initiatorAddress } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);

  const { colonyAddress } = listener as ExtensionEventListener;
  const colonyClient = await getCachedColonyClient(colonyAddress);
  if (!colonyClient) {
    return;
  }

  const releasedSlotIds = [];

  const logs = await provider.getLogs({
    fromBlock: blockNumber,
    toBlock: blockNumber,
    topics: [utils.id(ContractEventsSignatures.StagedPaymentReleased)],
  });

  const iface = getInterfaceByListener(listener);
  if (!iface) {
    return;
  }

  for (const log of logs) {
    const mappedEvent = await mapLogToContractEvent(log, iface);

    if (!mappedEvent) {
      continue;
    }

    // Check the expenditure ID matches the one in the first event
    const eventExpenditureId = toNumber(mappedEvent.args.expenditureId);

    if (eventExpenditureId === convertedExpenditureId) {
      releasedSlotIds.push(toNumber(mappedEvent.args.slot));
    }
  }

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  if (!releasedSlotIds.length) {
    return;
  }

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.ReleaseStagedPayments,
    initiatorAddress,
    expenditureId: databaseId,
    expenditureSlotIds: releasedSlotIds,
  });
};
