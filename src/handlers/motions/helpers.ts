import { BigNumber } from 'ethers';
import { mutate, query } from '~amplifyClient';
import {
  ColonyMotion,
  CreateMotionMessageDocument,
  CreateMotionMessageInput,
  GetColonyActionByMotionIdDocument,
  GetColonyActionByMotionIdQuery,
  GetColonyActionByMotionIdQueryVariables,
  GetColonyDecisionByActionIdDocument,
  GetColonyDecisionByActionIdQuery,
  GetColonyDecisionByActionIdQueryVariables,
  GetColonyMotionDocument,
  GetColonyMotionQuery,
  GetColonyMotionQueryVariables,
  UpdateColonyActionDocument,
  UpdateColonyDecisionDocument,
  UpdateColonyDecisionMutation,
  UpdateColonyDecisionMutationVariables,
  UpdateColonyMotionDocument,
} from '~graphql';
import { MotionSide, MotionVote } from '~types';
import { verbose, output } from '~utils';

export * from './motionStaked/helpers';

export const getMotionSide = (vote: BigNumber): MotionSide =>
  vote.eq(MotionVote.YAY) ? MotionSide.YAY : MotionSide.NAY;

const updateDecisionInDB = async (
  actionId: string,
  decisionData: Omit<UpdateColonyDecisionMutationVariables, 'id'>,
): Promise<void> => {
  const { data } =
    (await query<
      GetColonyDecisionByActionIdQuery,
      GetColonyDecisionByActionIdQueryVariables
    >(GetColonyDecisionByActionIdDocument, {
      actionId,
    })) ?? {};

  const decision = data?.getColonyDecisionByActionId?.items[0];

  if (decision)
    await mutate<
      UpdateColonyDecisionMutation,
      UpdateColonyDecisionMutationVariables
    >(UpdateColonyDecisionDocument, {
      id: decision.id,
      ...decisionData,
    });
};

export const updateMotionInDB = async (
  motionData: ColonyMotion,
  newMotionMessages?: CreateMotionMessageInput[],
  showInActionsList?: boolean,
): Promise<void> => {
  await mutate(UpdateColonyMotionDocument, {
    input: {
      ...motionData,
    },
  });

  if (newMotionMessages?.length) {
    for (const message of newMotionMessages) {
      await mutate(CreateMotionMessageDocument, {
        input: {
          ...message,
        },
      });
    }
  }

  if (showInActionsList !== undefined) {
    const { data } =
      (await query<
        GetColonyActionByMotionIdQuery,
        GetColonyActionByMotionIdQueryVariables
      >(GetColonyActionByMotionIdDocument, {
        motionId: motionData.id,
      })) ?? {};

    const colonyAction = data?.getColonyActionByMotionId?.items[0];

    if (!colonyAction) {
      verbose(
        'Could not find the action in the db. This is a bug and needs investigating.',
      );
    } else {
      await mutate(UpdateColonyActionDocument, {
        input: {
          id: colonyAction.id,
          showInActionsList,
        },
      });

      // If is decision
      if (colonyAction.colonyDecisionId) {
        await updateDecisionInDB(colonyAction.id, {
          showInDecisionsList: showInActionsList,
        });
      }
    }
  }
};

export const getMotionDatabaseId = (
  chainId: number,
  votingRepExtnAddress: string,
  nativeMotionId: BigNumber,
): string => `${chainId}-${votingRepExtnAddress}_${nativeMotionId}`;

export const getMotionFromDB = async (
  databaseMotionId: string,
): Promise<ColonyMotion | null | undefined> => {
  const { data } =
    (await query<GetColonyMotionQuery, GetColonyMotionQueryVariables>(
      GetColonyMotionDocument,
      {
        id: databaseMotionId,
      },
    )) ?? {};

  const motion = data?.getColonyMotion;

  if (!motion) {
    output(
      'Could not find the motion in the db. This is a bug and needs investigating.',
    );
  }

  return motion;
};

export const getMessageKey = (
  transactionHash: string,
  logIndex: number,
): string => {
  return `${transactionHash}${logIndex}`;
};

export const getColonyStakeId = (
  userAddress: string,
  colonyAddress: string,
): string => {
  return `${userAddress}_${colonyAddress}`;
};
