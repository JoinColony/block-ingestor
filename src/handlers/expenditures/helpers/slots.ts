import { ExpenditureFragment, ExpenditureSlot } from '~graphql';

/**
 * Helper function returning expenditure slots with updated recipient
 * of a given slot
 */
export const getSlotsWithUpdatedRecipient = (
  expenditure: ExpenditureFragment,
  slotId: number,
  recipientAddress: string,
): ExpenditureSlot[] => {
  const existingSlot = expenditure.slots.find((slot) => slot.id === slotId);
  const updatedSlot: ExpenditureSlot = {
    ...existingSlot,
    id: slotId,
    recipientAddress,
  };
  const updatedSlots = [
    ...expenditure.slots.filter((slot) => slot.id !== slotId),
    updatedSlot,
  ];

  return updatedSlots;
};

export const getSlotsWithUpdatedClaimDelay = (
  expenditure: ExpenditureFragment,
  slotId: number,
  claimDelay: number,
): ExpenditureSlot[] => {
  const existingSlot = expenditure.slots.find((slot) => slot.id === slotId);
  const updatedSlot: ExpenditureSlot = {
    ...existingSlot,
    id: slotId,
    claimDelay,
  };
  const updatedSlots = [
    ...expenditure.slots.filter((slot) => slot.id !== slotId),
    updatedSlot,
  ];

  return updatedSlots;
};
