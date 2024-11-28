import { BigNumber } from 'ethers';
import { mutate, query } from '~amplifyClient';
import {
  CreateUserVoterRewardDocument,
  CreateUserVoterRewardMutation,
  CreateUserVoterRewardMutationVariables,
  GetVoterRewardsDocument,
  GetVoterRewardsQuery,
  GetVoterRewardsQueryVariables,
} from '@joincolony/graphql';

export const createUserReward = async ({
  colonyAddress,
  motionId,
  motionDatabaseId,
  userAddress,
  rootHash,
  nativeMotionDomainId,
}: {
  colonyAddress: string;
  motionDatabaseId: string;
  motionId: string;
  userAddress: string;
  nativeMotionDomainId: string;
  rootHash: string;
}): Promise<void> => {
  // Get rewards for voters on the winning side

  const { data } =
    (await query<GetVoterRewardsQuery, GetVoterRewardsQueryVariables>(
      GetVoterRewardsDocument,
      {
        input: {
          rootHash,
          motionId,
          colonyAddress,
          nativeMotionDomainId,
          voterAddress: userAddress,
        },
      },
    )) ?? {};

  const { reward: voterReward } = data?.getVoterRewards ?? {};

  if (!voterReward || BigNumber.from(voterReward).eq('0')) {
    return;
  }

  await mutate<
    CreateUserVoterRewardMutation,
    CreateUserVoterRewardMutationVariables
  >(CreateUserVoterRewardDocument, {
    input: {
      userAddress,
      colonyAddress,
      amount: voterReward,
      motionId: motionDatabaseId,
    },
  });
};
