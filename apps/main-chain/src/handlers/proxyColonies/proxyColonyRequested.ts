import { ContractEvent, ContractEventsSignatures, ProxyColonyEvents } from '@joincolony/blocks';
import { output } from '@joincolony/utils';
import { utils } from 'ethers';
import blockManager from '~blockManager';
import rpcProvider from '~provider';
import { checkActionExists } from '~utils';
// import multiChainBridgeClient from '~multiChainBridgeClient';

export const handleProxyColonyRequested = async (
  event: ContractEvent,
): Promise<void> => {
  console.log('proxy colony requested event', event);
  const { blockNumber, transactionHash } = event;

  const actionExists = await checkActionExists(transactionHash);
  if (actionExists) {
    return;
  }

  // const response = await multiChainBridgeClient.fetchOperationDetails({
  //   emitterAddress,
  //   emitterChainId,
  //   sequence,
  // });
  // const data = await response.json();

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
    logs.map((log) => blockManager.mapLogToContractEvent(
      log,
      ProxyColonyEvents,
    )),
  );

  const wormholeEvent = events.find(event => ContractEventsSignatures.LogMessagePublished === event?.signature);
  const proxyRequestedEvent = events.find(event => ContractEventsSignatures.ProxyColonyRequested === event?.signature);

  if (!wormholeEvent || !proxyRequestedEvent) {
    output(`ProxyColonyRequested or LogMessagePublished are not present in the same block`);

    return;
  }

  console.log(wormholeEvent, proxyRequestedEvent);

  // save sender, sequence, nonce to save on the action object
  // set pending to true

};
