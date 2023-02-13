import { ContractEventsSignatures } from '~types';
import { addColonyEventListener } from '~utils/eventListeners';

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
  await addColonyEventListener(
    ContractEventsSignatures.DomainAdded,
    colonyAddress,
  );
  await addColonyEventListener(
    ContractEventsSignatures.DomainMetadata,
    colonyAddress,
  );
  await addColonyEventListener(
    ContractEventsSignatures.TokenUnlocked,
    colonyAddress,
  );
  await addColonyEventListener(
    ContractEventsSignatures.ColonyFundsMovedBetweenFundingPots,
    colonyAddress,
  );
  await addColonyEventListener(
    ContractEventsSignatures.ColonyMetadata,
    colonyAddress,
  );
};
