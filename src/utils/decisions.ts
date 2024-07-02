import { mutate, query } from '~amplifyClient';
import {
  GetColonyDecisionByActionIdDocument,
  GetColonyDecisionByActionIdQuery,
  GetColonyDecisionByActionIdQueryVariables,
  UpdateColonyDecisionDocument,
  UpdateColonyDecisionMutation,
  UpdateColonyDecisionMutationVariables,
} from '~graphql';

export const getColonyDecisionId = (
  colonyAddress: string,
  txHash: string,
): string => `${colonyAddress}_decision_${txHash}`;

export const updateDecisionInDB = async (
  actionId: string,
  decisionData: Omit<UpdateColonyDecisionMutationVariables, 'id'>,
): Promise<void> => {
  const { data } =
    (await query<
      GetColonyDecisionByActionIdQuery,
      GetColonyDecisionByActionIdQueryVariables
    >(GetColonyDecisionByActionIdDocument, {
      actionId,
    })) ?? {};

  const decision = data?.getColonyDecisionByActionId?.items[0];

  if (decision)
    await mutate<
      UpdateColonyDecisionMutation,
      UpdateColonyDecisionMutationVariables
    >(UpdateColonyDecisionDocument, {
      id: decision.id,
      ...decisionData,
    });
};
