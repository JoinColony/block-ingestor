import { ExpenditureFragment, ExpenditureSlot } from '~graphql';

/**
 * Function that updates an expenditure slot with a given ID and fields
 * It returns an array of expenditure slots containing the updated slot
 */
export const getUpdatedExpenditureSlots = (
  expenditureSlots: ExpenditureFragment['slots'],
  slotId: number,
  fieldsToUpdate: Partial<Omit<ExpenditureSlot, 'id' | '__typename'>>,
  previouslyUpdatedSlots?: ExpenditureFragment['slots'],
): ExpenditureSlot[] => {
  let existingSlot;

  const previouslyUpdatedSlot = previouslyUpdatedSlots?.find(
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

  let updatedSlots;

  if (previouslyUpdatedSlots) {
    updatedSlots = [
      ...previouslyUpdatedSlots.filter((slot) => slot.id !== slotId),
      updatedSlot,
    ];
  } else {
    updatedSlots = [
      ...expenditureSlots.filter((slot) => slot.id !== slotId),
      updatedSlot,
    ];
  }

  return updatedSlots;
};
