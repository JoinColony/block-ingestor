import { BigNumber } from 'ethers';
import { mutate, query } from '~amplifyClient';
import {
  GetUserMultiSigSignatureDocument,
  GetUserMultiSigSignatureQuery,
  GetUserMultiSigSignatureQueryVariables,
  MultiSigUserSignatureFragment,
  MultiSigVote,
  ColonyMultiSig,
  GetColonyMultiSigDocument,
  GetColonyMultiSigQuery,
  GetColonyMultiSigQueryVariables,
  UpdateColonyMultiSigDocument,
  UpdateColonyMultiSigInput,
  RemoveMultiSigVoteMutation,
  RemoveMultiSigVoteMutationVariables,
  RemoveMultiSigVoteDocument,
  CreateMultiSigVoteMutation,
  CreateMultiSigVoteMutationVariables,
  CreateMultiSigVoteDocument,
} from '@joincolony/graphql';
import { getBlockChainTimestampISODate } from '~utils/dates';
import { output } from '~utils/logger';

export const getMultiSigDatabaseId = (
  chainId: string,
  multiSigExtnAddress: string,
  nativeMultiSigId: BigNumber,
): string => `${chainId}-${multiSigExtnAddress}_${nativeMultiSigId}`;

interface GetUserMultiSigSignatureParams {
  multiSigId: string;
  userAddress: string;
  vote: MultiSigVote;
  role: number;
}
export const getUserMultiSigSignature = async ({
  multiSigId,
  userAddress,
  vote,
  role,
}: GetUserMultiSigSignatureParams): Promise<MultiSigUserSignatureFragment | null> => {
  const response = await query<
    GetUserMultiSigSignatureQuery,
    GetUserMultiSigSignatureQueryVariables
  >(GetUserMultiSigSignatureDocument, {
    vote,
    userAddress,
    multiSigId,
    role,
  });

  const responseItems =
    response?.data?.getMultiSigUserSignatureByMultiSigId?.items ?? [];

  if (responseItems.length > 0) {
    return responseItems[0];
  }

  return null;
};

export const getMultiSigFromDB = async (
  databaseMultiSigId: string,
): Promise<ColonyMultiSig | null | undefined> => {
  const { data } =
    (await query<GetColonyMultiSigQuery, GetColonyMultiSigQueryVariables>(
      GetColonyMultiSigDocument,
      {
        id: databaseMultiSigId,
      },
    )) ?? {};

  const multiSig = data?.getColonyMultiSig;

  if (!multiSig) {
    output(
      'Could not find the multiSig in the db. This is a bug and needs investigating.',
    );
  }

  return multiSig;
};

export const updateMultiSigInDB = async (
  multiSigData: UpdateColonyMultiSigInput,
): Promise<void> => {
  await mutate(UpdateColonyMultiSigDocument, {
    input: {
      ...multiSigData,
    },
  });
};

interface addMultiSigVoteParams {
  userAddress: string;
  colonyAddress: string;
  multiSigId: string;
  role: number;
  vote: MultiSigVote.Approve | MultiSigVote.Reject;
  timestamp: number;
}

export const addMultiSigVote = async ({
  multiSigId,
  role,
  userAddress,
  colonyAddress,
  vote,
  timestamp,
}: addMultiSigVoteParams): Promise<void> => {
  await mutate<CreateMultiSigVoteMutation, CreateMultiSigVoteMutationVariables>(
    CreateMultiSigVoteDocument,
    {
      input: {
        colonyAddress,
        multiSigId,
        userAddress,
        role,
        vote,
        createdAt: getBlockChainTimestampISODate(timestamp),
      },
    },
  );
};

export const removeMultiSigVote = async (id: string): Promise<void> => {
  await mutate<RemoveMultiSigVoteMutation, RemoveMultiSigVoteMutationVariables>(
    RemoveMultiSigVoteDocument,
    { id },
  );
};
