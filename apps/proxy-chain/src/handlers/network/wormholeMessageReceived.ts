import { ContractEvent } from '@joincolony/blocks';

export const handleWormholeMessageReceived = async (
  event: ContractEvent,
): Promise<void> => {
  console.log('WormholeMessageReceived', event);
};
