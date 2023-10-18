import { ExpenditureFragment, ExpenditureSlot } from '~graphql';

/**
 * Function that updates an expenditure slot with a given ID and fields
 * It returns an array of expenditure slots containing the updated slot
 */
export const getUpdatedExpenditureSlots = (
  expenditure: ExpenditureFragment,
  slotId: number,
  fieldsToUpdate: Partial<
    Omit<ExpenditureFragment['slots'][number], 'id' | '__typename'>
  >,
): ExpenditureSlot[] => {
  const existingSlot = expenditure.slots.find((slot) => slot.id === slotId);
  const updatedSlot: ExpenditureSlot = {
    ...existingSlot,
    id: slotId,
    ...fieldsToUpdate,
  };
  const updatedSlots = [
    ...expenditure.slots.filter((slot) => slot.id !== slotId),
    updatedSlot,
  ];

  return updatedSlots;
};
