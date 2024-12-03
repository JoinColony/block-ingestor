import { mutate, query } from '~amplifyClient';
import {
  GetActionIdFromAnnotationDocument,
  GetActionIdFromAnnotationQuery,
  GetActionIdFromAnnotationQueryVariables,
  GetMotionIdFromActionDocument,
  GetMotionIdFromActionQuery,
  GetMotionIdFromActionQueryVariables,
  UpdateColonyActionDocument,
  UpdateColonyActionMutation,
  UpdateColonyActionMutationVariables,
  UpdateColonyMotionDocument,
  UpdateColonyMotionMutation,
  UpdateColonyMotionMutationVariables,
} from '@joincolony/graphql';
import { ContractEvent } from '~types';
import { verbose } from '~utils';

export default async ({ args }: ContractEvent): Promise<void> => {
  const [, txHash] = args;

  const { data } =
    (await query<
      GetActionIdFromAnnotationQuery,
      GetActionIdFromAnnotationQueryVariables
    >(GetActionIdFromAnnotationDocument, { id: txHash })) ?? {};

  const actionId = data?.getAnnotation?.actionId;

  if (!actionId) {
    verbose('No annotation found in db for transaction:', txHash);
    return;
  }

  // If the actionId is the same as the txHash, it means we're annotating the original action.
  // Else, we're annotating an objection to a motion.
  const isMotionObjection = actionId !== txHash;

  verbose(
    isMotionObjection
      ? 'Adding objection annotation to db for motion: '
      : 'Adding annotation to db for action: ',
    actionId,
  );

  if (isMotionObjection) {
    const { data } =
      (await query<
        GetMotionIdFromActionQuery,
        GetMotionIdFromActionQueryVariables
      >(GetMotionIdFromActionDocument, { id: actionId })) ?? {};

    const motionId = data?.getColonyAction?.motionData?.id;

    if (!motionId) {
      verbose(
        `Detected objection annotation for action without associated motion. Action id: ${actionId}.
        Transaction being annotated: ${txHash}`,
      );
      return;
    }

    await mutate<
      UpdateColonyMotionMutation,
      UpdateColonyMotionMutationVariables
    >(UpdateColonyMotionDocument, {
      input: {
        id: motionId,
        objectionAnnotationId: txHash,
      },
    });
  } else {
    await mutate<
      UpdateColonyActionMutation,
      UpdateColonyActionMutationVariables
    >(UpdateColonyActionDocument, {
      input: { id: actionId, annotationId: txHash },
    });
  }
};
