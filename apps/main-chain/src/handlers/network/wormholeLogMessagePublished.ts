import { ContractEvent } from '@joincolony/blocks';

export const handleWormholeLogMessagePublished = async (
  event: ContractEvent,
): Promise<void> => {
  console.log('LogMessagePublished', event);
};
