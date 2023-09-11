import { ContractEvent } from '~types';

import { updateCancelledExpenditure } from './helpers';

export default async (event: ContractEvent): Promise<void> => {
  const { colonyAddress } = event;

  if (!colonyAddress) {
    return;
  }

  await updateCancelledExpenditure(colonyAddress, event);
};
