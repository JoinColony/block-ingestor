import { mutate } from '~amplifyClient';
import { UpdateColonyExtensionByAddressDocument } from '~graphql';
import { ExtensionParams } from '~types';
import { getVotingClient } from '~utils';

const getVotingReputationParams = async (
  colonyAddress: string,
): Promise<ExtensionParams> => {
  const votingClient = await getVotingClient(colonyAddress);
  const totalStakeFraction = (
    await votingClient.getTotalStakeFraction()
  ).toString();
  const voterRewardFraction = (
    await votingClient.getVoterRewardFraction()
  ).toString();
  const userMinStakeFraction = (
    await votingClient.getUserMinStakeFraction()
  ).toString();
  const maxVoteFraction = (await votingClient.getMaxVoteFraction()).toString();
  const stakePeriod = (await votingClient.getStakePeriod()).toString();
  const submitPeriod = (await votingClient.getSubmitPeriod()).toString();
  const revealPeriod = (await votingClient.getRevealPeriod()).toString();
  const escalationPeriod = (
    await votingClient.getEscalationPeriod()
  ).toString();

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
  const params = await getVotingReputationParams(colonyAddress);
  await mutate(UpdateColonyExtensionByAddressDocument, {
    input: {
      id: extensionAddress,
      params,
    },
  });
};
