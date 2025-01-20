import {
  ContractEventsSignatures,
  EventHandler,
  ProxyColoniesListener,
  ProxyColonyEvents,
} from '@joincolony/blocks';
import { output } from '@joincolony/utils';
import { utils } from 'ethers';
import blockManager from '~blockManager';
import rpcProvider from '~provider';
import { writeActionFromEvent } from '~utils/actions/writeAction';
import { ColonyActionType } from '@joincolony/graphql';

// @NOTE this one listens to the ProxyColonyRequested event on the colony, not the network!
export const handleProxyColonyRequested: EventHandler = async (
  event,
  listener,
) => {
  const { colonyAddress } = listener as ProxyColoniesListener;
  if (!colonyAddress) {
    output(`No colony address passed to handleProxyColonyRequested listener.`);
    return;
  }
  const { blockNumber } = event;

  const { agent, destinationChainId } = event.args;

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

  if (!wormholeEvent || !proxyRequestedEvent) {
    output(
      `ProxyColonyRequested or LogMessagePublished are not present in the same block`,
    );

    return;
  }

  const { sender, sequence } = wormholeEvent.args;
  const emitterAddress = sender.toString();
  const emitterSequence = sequence.toString();

  if (!emitterAddress || !sequence) {
    output('Missing arguments on the LogMessagePublished events');
    return;
  }

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.AddProxyColony,
    initiatorAddress: agent,
    targetChainId: destinationChainId.toNumber(),
    multiChainInfo: {
      completed: false,
      wormholeInfo: {
        sequence: emitterSequence,
        emitterAddress,
      },
    },
  });
};
