import { query } from '~amplifyClient';
import {
  ActionMetadataInfoFragment,
  GetColonyActionByMotionIdDocument,
  GetColonyActionByMotionIdQuery,
  GetColonyActionByMotionIdQueryVariables,
  GetColonyActionByMultiSigIdDocument,
  GetColonyActionByMultiSigIdQuery,
  GetColonyActionByMultiSigIdQueryVariables,
} from '~graphql';

export const getActionByMotionId = async (
  motionId: string,
): Promise<ActionMetadataInfoFragment | null> => {
  const response = await query<
    GetColonyActionByMotionIdQuery,
    GetColonyActionByMotionIdQueryVariables
  >(GetColonyActionByMotionIdDocument, {
    motionId,
  });

  const colonyAction =
    response?.data?.getColonyActionByMotionId?.items[0] ?? null;
  return colonyAction;
};

export const getActionByMultiSigId = async (
  multiSigId: string,
): Promise<ActionMetadataInfoFragment | null> => {
  const response = await query<
    GetColonyActionByMultiSigIdQuery,
    GetColonyActionByMultiSigIdQueryVariables
  >(GetColonyActionByMultiSigIdDocument, {
    multiSigId,
  });

  const colonyAction =
    response?.data?.getColonyActionByMultiSigId?.items[0] ?? null;
  return colonyAction;
};
