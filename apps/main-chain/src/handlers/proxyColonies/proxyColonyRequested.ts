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
import { getAndSyncMultiChainInfo } from '~utils/crossChain';

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
  const { blockNumber, transactionHash } = event;

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

  const multiChainInfoId = await getAndSyncMultiChainInfo(
    wormholeEvent,
    transactionHash,
    Number(destinationChainId),
  );

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.AddProxyColony,
    initiatorAddress: agent,
    targetChainId: destinationChainId.toNumber(),
    multiChainInfoId,
  });
};
