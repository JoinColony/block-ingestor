import { ContractEvent } from '@joincolony/blocks';

export const handleProxyColonyRequested = async (
  event: ContractEvent,
): Promise<void> => {
  console.log('proxy colony requested event', event);
};
