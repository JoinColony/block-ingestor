import { ExpenditureFragment, ExpenditureSlot } from '@joincolony/graphql';

/**
 * Function that updates an expenditure slot with a given ID and fields
 * It returns an array of expenditure slots containing the updated slot
 */
export const getUpdatedExpenditureSlots = (
  expenditureSlots: ExpenditureFragment['slots'],
  slotId: number,
  fieldsToUpdate: Partial<Omit<ExpenditureSlot, 'id' | '__typename'>>,
): ExpenditureSlot[] => {
  const existingSlot = expenditureSlots.find((slot) => slot.id === slotId);
  const updatedSlot: ExpenditureSlot = {
    ...existingSlot,
    id: slotId,
    ...fieldsToUpdate,
  };
  const updatedSlots = [
    ...expenditureSlots.filter((slot) => slot.id !== slotId),
    updatedSlot,
  ];

  return updatedSlots;
};
