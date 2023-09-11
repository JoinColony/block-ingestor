import { ContractEvent } from '~types';

import { updateCancelledExpenditure } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;

  await updateCancelledExpenditure(colonyAddress, event);
};
