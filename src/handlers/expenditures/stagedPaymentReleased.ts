import { mutate, query } from '~amplifyClient';
import { ExtensionEventListener } from '~eventListeners';
import {
  GetExpenditureMetadataDocument,
  GetExpenditureMetadataQuery,
  GetExpenditureMetadataQueryVariables,
  UpdateExpenditureMetadataDocument,
  UpdateExpenditureMetadataMutation,
  UpdateExpenditureMetadataMutationVariables,
} from '~graphql';
import { EventHandler } from '~types';
import {
  getExpenditureDatabaseId,
  insertAtIndex,
  output,
  toNumber,
  verbose,
} from '~utils';

export const handleStagedPaymentReleased: EventHandler = async (
  event,
  listener,
) => {
  const { expenditureId, slot } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);
  const convertedSlot = toNumber(slot);
  const { colonyAddress } = listener as ExtensionEventListener;

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  const response = await query<
    GetExpenditureMetadataQuery,
    GetExpenditureMetadataQueryVariables
  >(GetExpenditureMetadataDocument, {
    id: databaseId,
  });
  const metadata = response?.data?.getExpenditureMetadata;

  if (!metadata?.stages) {
    output(
      `Could not find stages data for expenditure with ID: ${databaseId}. This is a bug and needs investigating.`,
    );
    return;
  }

  const existingStageIndex = metadata.stages.findIndex(
    (stage) => stage.slotId === convertedSlot,
  );
  const existingStage = metadata.stages[existingStageIndex];

  // If the stage doesn't exist or it's been already set to released, we don't need to do anything
  if (!existingStage || existingStage.isReleased) {
    return;
  }

  const updatedStage = {
    ...existingStage,
    isReleased: true,
  };
  const updatedStages = insertAtIndex(
    metadata.stages,
    existingStageIndex,
    updatedStage,
  );

  verbose(`Stage released in expenditure with ID: ${databaseId}`);

  await mutate<
    UpdateExpenditureMetadataMutation,
    UpdateExpenditureMetadataMutationVariables
  >(UpdateExpenditureMetadataDocument, {
    input: {
      id: databaseId,
      stages: updatedStages,
    },
  });
};
