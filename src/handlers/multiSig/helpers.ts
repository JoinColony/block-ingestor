import { BigNumber } from 'ethers';
import { query } from '~amplifyClient';
import {
  GetUserMultiSigSignatureDocument,
  GetUserMultiSigSignatureQuery,
  GetUserMultiSigSignatureQueryVariables,
  MultiSigUserSignatureFragment,
  MultiSigVote,
} from '~graphql';

export const getMultiSigDatabaseId = (
  chainId: string,
  multiSigExtnAddress: string,
  nativeMotionId: BigNumber,
): string => `${chainId}-${multiSigExtnAddress}_${nativeMotionId}`;

interface GetUserMultiSigSignatureParams {
  multiSigId: string;
  userAddress: string;
  vote: MultiSigVote;
}
export const getUserMultiSigSignature = async ({
  multiSigId,
  userAddress,
  vote,
}: GetUserMultiSigSignatureParams): Promise<MultiSigUserSignatureFragment | null> => {
  const response = await query<
    GetUserMultiSigSignatureQuery,
    GetUserMultiSigSignatureQueryVariables
  >(GetUserMultiSigSignatureDocument, {
    vote,
    userAddress,
    multiSigId,
  });

  const responseItems =
    response?.data?.getMultiSigUserSignatureByMultiSigId?.items ?? [];

  if (responseItems.length > 0) {
    return responseItems[0];
  }

  return null;
};
