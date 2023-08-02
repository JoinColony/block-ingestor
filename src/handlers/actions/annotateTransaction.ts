import { mutate } from '~amplifyClient';
import {
  UpdateColonyActionDocument,
  UpdateColonyActionMutation,
  UpdateColonyActionMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';

export default async ({ args }: ContractEvent): Promise<void> => {
  const [, actionTxHash] = args;

  await mutate<UpdateColonyActionMutation, UpdateColonyActionMutationVariables>(
    UpdateColonyActionDocument,
    { input: { id: actionTxHash, annotationId: actionTxHash } },
  );
};
