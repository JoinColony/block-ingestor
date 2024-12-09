import {
  ContractEvent,
  ContractEventsSignatures,
  ProxyColonyEvents,
} from '@joincolony/blocks';
import { output } from '@joincolony/utils';
import { constants, utils } from 'ethers';
import blockManager from '~blockManager';
import rpcProvider from '~provider';
import { writeActionFromEvent } from '~utils/actions/writeAction';
import { ColonyActionType } from '@joincolony/graphql';

export const handleProxyColonyRequested = async (
  event: ContractEvent,
): Promise<void> => {
  const { blockNumber, contractAddress: colonyAddress } = event;

  const { destinationChainId } = event.args;

  const logs = await rpcProvider.getProviderInstance().getLogs({
    fromBlock: blockNumber,
    toBlock: blockNumber,
    topics: [
      [
        utils.id(ContractEventsSignatures.ProxyColonyRequested),
        utils.id(ContractEventsSignatures.LogMessagePublished),
      ],
    ],
  });

  const events = await Promise.all(
    logs.map((log) =>
      blockManager.mapLogToContractEvent(log, ProxyColonyEvents),
    ),
  );

  const wormholeEvent = events.find(
    (event) =>
      ContractEventsSignatures.LogMessagePublished === event?.signature,
  );
  const proxyRequestedEvent = events.find(
    (event) =>
      ContractEventsSignatures.ProxyColonyRequested === event?.signature,
  );

  // @NOTE remove this log once we know for sure which data we need from the events
  console.log(wormholeEvent, proxyRequestedEvent);

  if (!wormholeEvent || !proxyRequestedEvent) {
    output(
      `ProxyColonyRequested or LogMessagePublished are not present in the same block`,
    );

    return;
  }

  const { sender, sequence } = wormholeEvent.args;
  const emitterAddress = sender.toString();
  const emitterSequence = sequence.toString();
  // @TODO this needs to be updated to the correct value
  const emitterChainId = destinationChainId.toNumber();

  if (!emitterChainId || !emitterAddress || !sequence) {
    output(
      'Missing arguments on the ProxyColonyRequested and the LogMessagePublished events',
    );
    return;
  }

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.AddProxyColony,
    initiatorAddress: constants.AddressZero,
    multiChainInfo: {
      completed: false,
      targetChainId: destinationChainId.toNumber(),
      wormholeInfo: {
        emitterChainId,
        sequence: emitterSequence,
        emitterAddress,
      },
    },
  });
};
