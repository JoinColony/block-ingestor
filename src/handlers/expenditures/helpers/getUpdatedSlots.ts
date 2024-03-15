import { ExpenditureFragment, ExpenditureSlot } from '~graphql';

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

/**
 * Function that updates an expenditure slot with a given ID and fields
 * It returns an array of expenditure slots containing the updated slot
 * Requires an array of previously updates slots and will check for matching slots here first
 */
export const getUpdatedExpenditureSlotsWithHistory = (
  expenditureSlots: ExpenditureFragment['slots'],
  slotId: number,
  fieldsToUpdate: Partial<Omit<ExpenditureSlot, 'id' | '__typename'>>,
  previouslyUpdatedSlots: ExpenditureFragment['slots'],
): ExpenditureSlot[] => {
  let existingSlot;

  const previouslyUpdatedSlot = previouslyUpdatedSlots.find(
    (slot) => slot.id === slotId,
  );
  if (previouslyUpdatedSlot) {
    existingSlot = previouslyUpdatedSlot;
  } else {
    existingSlot = expenditureSlots.find((slot) => slot.id === slotId);
  }
  const updatedSlot: ExpenditureSlot = {
    ...existingSlot,
    id: slotId,
    ...fieldsToUpdate,
  };

  const updatedSlots = [
    ...previouslyUpdatedSlots.filter((slot) => slot.id !== slotId),
    updatedSlot,
  ];

  return updatedSlots;
};
