import { ContractEvent } from '~types';

export const handleProxyColonyDeployed = async (
  event: ContractEvent,
): Promise<void> => {
  console.log('proxy colony deployed event', event);
};
