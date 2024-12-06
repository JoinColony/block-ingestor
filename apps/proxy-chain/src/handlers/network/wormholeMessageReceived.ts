import { ContractEvent } from '@joincolony/blocks';
import { WormholeClient } from '@joincolony/clients';
import rpcProvider from '~provider';

const bridgeEndpoint = process.env.MULTI_CHAIN_BRIDGE_ENDPOINT ?? '';

export const handleWormholeMessageReceived = async (
  event: ContractEvent,
): Promise<void> => {
  console.log('WormholeMessageReceived', event);
  
  const { emitterChainId, emitterAddress, sequence } = event.args;
  console.log(bridgeEndpoint, sequence);
  const client = new WormholeClient(bridgeEndpoint);


  const chainId = await rpcProvider.getChainId();

  console.log(`RPC provider chain id`, chainId);
  console.log(`Mapped wormhole chain id`, client.getWormholeChainId(chainId));

  const response = await client.fetchOperationDetails({
    emitterAddress,
    emitterChainId,
    sequence,
  });
  const data = await response.json();

  console.log(`Response from wormhole`, data);
};
