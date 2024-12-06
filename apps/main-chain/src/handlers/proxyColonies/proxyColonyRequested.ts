import {
  ContractEvent,
  ContractEventsSignatures,
  ProxyColonyEvents,
} from '@joincolony/blocks';
import { output } from '@joincolony/utils';
import { utils } from 'ethers';
import blockManager from '~blockManager';
import rpcProvider from '~provider';
import { writeActionFromEvent } from '~utils/actions/writeAction';
import { ColonyActionType } from '@joincolony/graphql';

export const handleProxyColonyRequested = async (
  event: ContractEvent,
): Promise<void> => {
  const { blockNumber, contractAddress: colonyAddress } = event;

  const { agent: initiatorAddress, destinationChainId } = event.args;

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

  const { emitterChainId, emitterAddress, sequence } = wormholeEvent.args;

  if (!emitterChainId || !emitterAddress || !sequence) {
    output('Missing arguments on the LogMessagePublished event');
    return;
  }

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.AddProxyColony,
    initiatorAddress,
    multiChainInfo: {
      completed: false,
      targetChainId: destinationChainId,
      wormholeInfo: {
        emitterChainId,
        sequence,
        emitterAddress,
      },
    },
  });
};
