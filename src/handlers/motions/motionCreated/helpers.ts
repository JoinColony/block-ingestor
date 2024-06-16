import { BigNumber } from 'ethers';
import { AnyVotingReputationClient } from '@colony/colony-js';

import { ContractEvent, MotionEvents } from '~types';
import {
  createColonyAction,
  getDomainDatabaseId,
  getVotingClient,
} from '~utils';
import { GraphQLFnReturn, mutate } from '~amplifyClient';
import {
  ColonyMotion,
  CreateColonyActionInput,
  CreateColonyMotionDocument,
  CreateColonyMotionInput,
  CreateColonyMotionMutation,
  CreateColonyMotionMutationVariables,
  CreateMotionMessageDocument,
  CreateMotionMessageInput,
  CreateMotionMessageMutation,
  CreateMotionMessageMutationVariables,
} from '~graphql';
import networkClient from '~networkClient';

import {
  getMotionDatabaseId,
  getRequiredStake,
  getUserMinStake,
  getMessageKey,
} from '../helpers';

interface GetMotionDataArgs {
  transactionHash: string;
  motionId: BigNumber;
  domainId: BigNumber;
  votingClient: AnyVotingReputationClient;
  colonyAddress: string;
  isDecision?: boolean;
}

export const getMotionData = async ({
  transactionHash,
  motionId,
  domainId,
  votingClient,
  colonyAddress,
  isDecision = false,
}: GetMotionDataArgs): Promise<ColonyMotion> => {
  const { skillRep, repSubmitted } = await votingClient.getMotion(motionId);
  const totalStakeFraction = await votingClient.getTotalStakeFraction();
  const userMinStakeFraction = await votingClient.getUserMinStakeFraction();
  const requiredStake: string = getRequiredStake(
    skillRep,
    totalStakeFraction,
  ).toString();

  const userMinStake = getUserMinStake(
    totalStakeFraction,
    userMinStakeFraction,
    skillRep,
  );

  const { chainId } = await votingClient.provider.getNetwork();
  const motionDatabaseId = getMotionDatabaseId(
    chainId,
    votingClient.address,
    motionId,
  );

  return {
    createdBy: votingClient.address,
    id: motionDatabaseId,
    nativeMotionId: motionId.toString(),
    motionStakes: {
      raw: {
        nay: '0',
        yay: '0',
      },
      percentage: {
        nay: '0',
        yay: '0',
      },
    },
    requiredStake,
    remainingStakes: [requiredStake, requiredStake], // [nayRemaining, yayRemaining]
    usersStakes: [],
    userMinStake,
    motionDomainId: getDomainDatabaseId(colonyAddress, domainId.toNumber()),
    nativeMotionDomainId: domainId.toString(),
    stakerRewards: [],
    voterRecord: [],
    isFinalized: false,
    revealedVotes: {
      raw: {
        nay: '0',
        yay: '0',
      },
      percentage: {
        nay: '0',
        yay: '0',
      },
    },
    repSubmitted: repSubmitted.toString(),
    skillRep: skillRep.toString(),
    hasObjection: false,
    motionStateHistory: {
      hasVoted: false,
      hasPassed: false,
      hasFailed: false,
      hasFailedNotFinalizable: false,
      inRevealPhase: false,
    },
    isDecision,
    transactionHash,
  };
};

const getInitialMotionMessage = async (
  votingClient: AnyVotingReputationClient,
  motionId: BigNumber,
  transactionHash: string,
  logIndex: number,
  creatorAddress: string,
): Promise<CreateMotionMessageInput> => {
  const { chainId } = await votingClient.provider.getNetwork();
  const motionDatabaseId = getMotionDatabaseId(
    chainId,
    votingClient.address,
    motionId,
  );

  return {
    name: MotionEvents.MotionCreated,
    messageKey: getMessageKey(transactionHash, logIndex),
    initiatorAddress: creatorAddress,
    motionId: motionDatabaseId,
  };
};

const createColonyMotion = async (
  motionData: CreateColonyMotionInput,
): Promise<void> => {
  await mutate<CreateColonyMotionMutation, CreateColonyMotionMutationVariables>(
    CreateColonyMotionDocument,
    {
      input: {
        ...motionData,
      },
    },
  );
};

const createMotionMessage = async (
  initialMotionMessage: CreateMotionMessageInput,
): Promise<void> => {
  await mutate<
    CreateMotionMessageMutation,
    CreateMotionMessageMutationVariables
  >(CreateMotionMessageDocument, {
    input: {
      ...initialMotionMessage,
    },
  });
};

type MotionFields = Omit<
  CreateColonyActionInput,
  | 'id'
  | 'colonyId'
  | 'showInActionsList'
  | 'isMotion'
  | 'motionId'
  | 'initiatorAddress'
  | 'blockNumber'
  | 'rootHash'
> &
  Pick<
    CreateColonyMotionInput,
    'expenditureSlotIds' | 'editedExpenditureSlots' | 'expenditureFunding'
  >;

export const createMotionInDB = async (
  colonyAddress: string,
  event: ContractEvent,
  motionFields: MotionFields,
): Promise<GraphQLFnReturn<CreateColonyMotionMutation> | undefined> => {
  const {
    transactionHash,
    blockNumber,
    logIndex,
    args: { motionId, creator: creatorAddress, domainId },
    timestamp,
  } = event;
  const {
    expenditureSlotIds,
    editedExpenditureSlots,
    expenditureFunding,
    ...actionFields
  } = motionFields;

  const votingClient = await getVotingClient(colonyAddress);
  if (!votingClient) {
    return;
  }

  const motionData = await getMotionData({
    transactionHash,
    votingClient,
    motionId,
    domainId,
    colonyAddress,
    isDecision: !!actionFields.colonyDecisionId,
  });

  const initialMotionMessage = await getInitialMotionMessage(
    votingClient,
    motionId,
    transactionHash,
    logIndex,
    creatorAddress,
  );

  const rootHash = await networkClient.getReputationRootHash({
    blockTag: blockNumber,
  });

  const actionData = {
    id: transactionHash,
    colonyId: colonyAddress,
    isMotion: true,
    showInActionsList: false,
    motionId: motionData.id,
    initiatorAddress: creatorAddress,
    blockNumber,
    rootHash,
    isMotionFinalization: false,
    ...actionFields,
  };

  await Promise.all([
    createColonyMotion({
      ...motionData,
      expenditureId: actionFields.expenditureId,
      expenditureSlotIds,
      editedExpenditureSlots,
      expenditureFunding,
    }),
    createMotionMessage(initialMotionMessage),
    createColonyAction(actionData, timestamp),
  ]);
};
