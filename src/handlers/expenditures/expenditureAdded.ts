import { ContractEvent } from '~types';

export default async (event: ContractEvent): Promise<void> => {
  console.log('Expenditure Added Event!');
  console.log(event);
};
