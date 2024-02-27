import { ContractEvent } from '~types';

export default async (event: ContractEvent): Promise<void> => {
  console.log(event);
};
