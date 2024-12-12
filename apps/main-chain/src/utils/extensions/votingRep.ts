import { AnyVotingReputationClient } from '@colony/colony-js';
import { ExtensionParams } from '@joincolony/graphql';
import { getVotingClient } from '~utils';
import { updateExtension } from './updateExtension';

const getVotingReputationParams = async (
  votingClient: AnyVotingReputationClient,
): Promise<ExtensionParams> => {
  const [
    totalStakeFraction,
    voterRewardFraction,
    userMinStakeFraction,
    maxVoteFraction,
    stakePeriod,
    submitPeriod,
    revealPeriod,
    escalationPeriod,
  ] = (
    await Promise.all([
      votingClient.getTotalStakeFraction(),
      votingClient.getVoterRewardFraction(),
      votingClient.getUserMinStakeFraction(),
      votingClient.getMaxVoteFraction(),
      votingClient.getStakePeriod(),
      votingClient.getSubmitPeriod(),
      votingClient.getRevealPeriod(),
      votingClient.getEscalationPeriod(),
    ])
  ).map((bigNum) => bigNum.toString());

  return {
    votingReputation: {
      totalStakeFraction,
      voterRewardFraction,
      userMinStakeFraction,
      maxVoteFraction,
      stakePeriod,
      submitPeriod,
      revealPeriod,
      escalationPeriod,
    },
  };
};

export const addVotingReputationParamsToDB = async (
  extensionAddress: string,
  colonyAddress: string,
): Promise<void> => {
  const votingClient = await getVotingClient(colonyAddress);

  if (!votingClient) {
    return;
  }

  const params = await getVotingReputationParams(votingClient);
  await updateExtension(extensionAddress, { params });
};
