import { ContractEvent /*, ContractEventsSignatures */ } from '~types';
import {
  getCachedColonyClient,
  // getExpenditureDatabaseId,
  // mapLogToContractEvent,
  // output,
  // toNumber,
  // verbose,
  // writeActionFromEvent,
} from '~utils';
// import {
//   ColonyActionType,
//   ExpenditureSlot,
//   GetActionByIdDocument,
//   GetActionByIdQuery,
//   GetActionByIdQueryVariables,
//   UpdateColonyActionDocument,
//   UpdateColonyActionMutation,
//   UpdateColonyActionMutationVariables,
//   UpdateExpenditureDocument,
//   UpdateExpenditureMutation,
//   UpdateExpenditureMutationVariables,
// } from '~graphql';
// import { mutate, query } from '~amplifyClient';

// import {
//   getExpenditureFromDB,
//   decodeUpdatedSlot,
//   decodeUpdatedStatus,
//   getUpdatedExpenditureSlots,
// } from './helpers';
// import provider from '~provider';
// import { utils } from 'ethers';
import { createEditExpenditureAction } from './helpers/createEditExpenditureAction';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;

  const colonyClient = await getCachedColonyClient(colonyAddress);
  if (!colonyClient) {
    return;
  }

  await createEditExpenditureAction(event, colonyClient);

  // const {
  //   storageSlot,
  //   expenditureId,
  //   value,
  //   agent: initiatorAddress,
  // } = event.args;
  // // The unfortunate naming of the `keys` property means we have to access it like so
  // const keys = event.args[4];
  // const convertedExpenditureId = toNumber(expenditureId);

  // const databaseId = getExpenditureDatabaseId(
  //   colonyAddress,
  //   convertedExpenditureId,
  // );

  // const expenditure = await getExpenditureFromDB(databaseId);
  // if (!expenditure) {
  //   output(
  //     `Could not find expenditure with ID: ${databaseId} in the db when handling ExpenditureStateChanged event`,
  //   );
  //   return;
  // }

  // const updatedSlot = decodeUpdatedSlot(expenditure, storageSlot, keys, value);

  // let updatedSlots: ExpenditureSlot[] | undefined;
  // if (updatedSlot) {
  //   updatedSlots = getUpdatedExpenditureSlots(
  //     expenditure.slots,
  //     updatedSlot.id,
  //     updatedSlot,
  //   );
  // }

  // const updatedStatus = decodeUpdatedStatus(storageSlot, keys, value);

  // verbose(`State of expenditure with ID ${databaseId} updated`);

  // await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
  //   UpdateExpenditureDocument,
  //   {
  //     input: {
  //       id: databaseId,
  //       slots: updatedSlots,
  //       status: updatedStatus,
  //     },
  //   },
  // );

  // const preUpdateSlot = expenditure.slots.find(
  //   ({ id }) => id === updatedSlot?.id,
  // );

  // const existingActionQuery = await query<
  //   GetActionByIdQuery,
  //   GetActionByIdQueryVariables
  // >(GetActionByIdDocument, {
  //   id: transactionHash,
  // });
  // if (!existingActionQuery?.data?.getColonyAction) {
  //   await writeActionFromEvent(event, colonyAddress, {
  //     type: ColonyActionType.EditExpenditure,
  //     initiatorAddress,
  //     expenditureId: databaseId,
  //     expenditureSlotChanges: {
  //       oldSlots: preUpdateSlot ? [preUpdateSlot] : [],
  //       newSlots: updatedSlot ? [updatedSlot] : [],
  //     },
  //   });
  // } else {
  //   await mutate<
  //     UpdateColonyActionMutation,
  //     UpdateColonyActionMutationVariables
  //   >(UpdateColonyActionDocument, {
  //     input: {
  //       id: transactionHash,
  //       expenditureSlotChanges: {
  //         oldSlots: preUpdateSlot ? [preUpdateSlot] : [],
  //         newSlots: updatedSlot ? [updatedSlot] : [],
  //       },
  //     },
  //   });
  //   console.log('\n\n\n Action existing, should append \n\n\n');
  // }
};
