import { AnyVotingReputationClient } from '@colony/colony-js/*';
import { mutate } from '~amplifyClient';
import { UpdateColonyExtensionByAddressDocument } from '~graphql';
import { ExtensionParams } from '~types';
import { getVotingClient } from '~utils';

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
  await mutate(UpdateColonyExtensionByAddressDocument, {
    input: {
      id: extensionAddress,
      params,
    },
  });
};
