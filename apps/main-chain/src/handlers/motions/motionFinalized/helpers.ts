import { BigNumber } from 'ethers';
import { BlockTag } from '@ethersproject/abstract-provider';
import { AnyVotingReputationClient, Extension } from '@colony/colony-js';

import { ColonyOperations, MotionVote } from '~types';
import {
  getCachedColonyClient,
  getColonyFromDB,
  parseFunctionData,
} from '~utils';
import amplifyClient from '~amplifyClient';
import {
  ColonyActionType,
  ColonyMotion,
  GetColonyActionByMotionIdDocument,
  GetColonyActionByMotionIdQuery,
  GetColonyActionByMotionIdQueryVariables,
  StakerReward,
  UpdateColonyActionDocument,
  UpdateColonyActionMutation,
  UpdateColonyActionMutationVariables,
  UpdateColonyDocument,
} from '@joincolony/graphql';
import { getAmountLessFee, getNetworkInverseFee } from '~utils/networkFee';
import { output } from '@joincolony/utils';

export const getStakerReward = async (
  motionId: string,
  userAddress: string,
  votingReputationClient: AnyVotingReputationClient,
  blockNumber: BlockTag = 'latest',
): Promise<StakerReward> => {
  /*
   * If **anyone** staked on a side, calling the rewards function returns 0 if there's no reward (even for
   * a user who didnd't stake).
   *
   * But calling the rewards function on a side where **no one** has voted
   * will result in an error being thrown.
   *
   * Hence the try/catch.
   */
  let stakingRewardYay = BigNumber.from(0);
  let stakingRewardNay = BigNumber.from(0);
  try {
    [stakingRewardYay] = await votingReputationClient.getStakerReward(
      motionId,
      userAddress,
      MotionVote.YAY,
      { blockTag: blockNumber },
    );
  } catch (error) {
    // We don't care to catch the error since we fallback to it's initial value
  }
  try {
    [stakingRewardNay] = await votingReputationClient.getStakerReward(
      motionId,
      userAddress,
      MotionVote.NAY,
      { blockTag: blockNumber },
    );
  } catch (error) {
    // silent error
  }

  return {
    address: userAddress,
    rewards: {
      nay: stakingRewardNay.toString(),
      yay: stakingRewardYay.toString(),
    },
    isClaimed: false,
  };
};

export const updateColonyUnclaimedStakes = async (
  colonyAddress: string,
  motionDatabaseId: string,
  updatedStakerRewards: StakerReward[],
): Promise<void> => {
  const colony = await getColonyFromDB(colonyAddress);
  if (colony) {
    /*
     * @NOTE: We only want to store unclaimed stakes that have a non-zero yay or nay reward.
     * Otherwise, they will show up as unclaimed stakes in the stakes tab, but will not be claimable.
     */
    const unclaimedRewards = updatedStakerRewards.filter(
      ({ rewards }) => rewards.yay !== '0' || rewards.nay !== '0',
    );
    const unclaimedMotionStake = {
      motionId: motionDatabaseId,
      unclaimedRewards,
    };

    let { motionsWithUnclaimedStakes } = colony;

    if (motionsWithUnclaimedStakes) {
      motionsWithUnclaimedStakes.push(unclaimedMotionStake);
    } else {
      motionsWithUnclaimedStakes = [unclaimedMotionStake];
    }

    await amplifyClient.mutate(UpdateColonyDocument, {
      input: {
        id: colonyAddress,
        motionsWithUnclaimedStakes,
      },
    });
  }
};

/*
 * When a Simple Payment motion is finalized, we want to update the action in the database
 * to include the networkFee and the amount excluding the fee at the time of finalization
 */
export const updateAmountToExcludeNetworkFee = async (
  action: string,
  colonyAddress: string,
  finalizedMotion: ColonyMotion,
): Promise<void> => {
  const colonyClient = await getCachedColonyClient(colonyAddress);
  const oneTxPaymentClient =
    (await colonyClient?.getExtensionClient(Extension.OneTxPayment)) ?? null;

  if (!oneTxPaymentClient) {
    return;
  }

  const parsedAction = parseFunctionData(action, [
    oneTxPaymentClient.interface,
  ]);

  if (
    !parsedAction ||
    parsedAction.name !== ColonyOperations.MakePaymentFundedFromDomain
  ) {
    return;
  }

  const { data } =
    (await amplifyClient.query<
      GetColonyActionByMotionIdQuery,
      GetColonyActionByMotionIdQueryVariables
    >(GetColonyActionByMotionIdDocument, {
      motionId: finalizedMotion.id,
    })) ?? {};

  const colonyAction = data?.getColonyActionByMotionId?.items[0];

  if (!colonyAction) {
    return;
  }

  if (colonyAction.type === ColonyActionType.PaymentMotion) {
    if (colonyAction.networkFee) {
      return;
    }

    if (!colonyAction.amount) {
      return;
    }

    const networkInverseFee = await getNetworkInverseFee();
    if (!networkInverseFee) {
      output(
        'Network inverse fee not found. This is a bug and should be investigated.',
      );
      return;
    }

    const amountWithFee = colonyAction.amount;

    const amountLessFee = getAmountLessFee(amountWithFee, networkInverseFee);
    const networkFee = BigNumber.from(amountWithFee).sub(amountLessFee);

    await amplifyClient.mutate<
      UpdateColonyActionMutation,
      UpdateColonyActionMutationVariables
    >(UpdateColonyActionDocument, {
      input: {
        id: colonyAction.id,
        amount: amountLessFee.toString(),
        networkFee: networkFee.toString(),
      },
    });
  }
};
