import { ContractEventsSignatures } from '../../types';
import { addColonyEventListener } from '../events';

export const addActionEventListeners = async (
  colonyAddress: string,
): Promise<void> => {
  await addColonyEventListener(
    ContractEventsSignatures.TokensMinted,
    colonyAddress,
  );
  await addColonyEventListener(
    ContractEventsSignatures.PaymentAdded,
    colonyAddress,
  );
};
