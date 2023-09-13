import { ContractEvent } from '~types';

import { updateCancelledExpenditure } from './helpers';
import { handleStakedExpenditureCancelled } from '.';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;

  /**
   * TEMP: If colonyAddress is present on the event object, the event was emitted
   * by the Staked Expenditure extension
   * @TODO: Refactor eventProcessor switch to link handlers with their respective listeners
   */
  if (event.colonyAddress) {
    await handleStakedExpenditureCancelled(event);
    return;
  }

  await updateCancelledExpenditure(colonyAddress, event);
};
