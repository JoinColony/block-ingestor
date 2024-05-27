import { mutate } from '~amplifyClient';
import {
  CreateApprovalVoteDocument,
  CreateApprovalVoteMutation,
  CreateApprovalVoteMutationVariables,
  MultiSigVote,
  RemoveMultiSigVoteDocument,
  RemoveMultiSigVoteMutation,
  RemoveMultiSigVoteMutationVariables,
} from '~graphql';

interface AddApprovalVoteParams {
  userAddress: string;
  multiSigId: string;
  role: number;
}

export const addApprovalVote = async ({
  multiSigId,
  role,
  userAddress,
}: AddApprovalVoteParams): Promise<void> => {
  await mutate<CreateApprovalVoteMutation, CreateApprovalVoteMutationVariables>(
    CreateApprovalVoteDocument,
    {
      input: {
        multiSigId,
        userAddress,
        role,
        vote: MultiSigVote.Approve,
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
