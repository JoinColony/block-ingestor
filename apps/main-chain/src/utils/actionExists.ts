import amplifyClient from '~amplifyClient';
import {
  GetActionByIdDocument,
  GetActionByIdQuery,
  GetActionByIdQueryVariables,
} from '@joincolony/graphql';

export const checkActionExists = async (
  transactionHash: string,
): Promise<boolean> => {
  const existingActionQuery = await amplifyClient.query<
    GetActionByIdQuery,
    GetActionByIdQueryVariables
  >(GetActionByIdDocument, {
    id: transactionHash,
  });

  return !!existingActionQuery?.data?.getColonyAction;
};
