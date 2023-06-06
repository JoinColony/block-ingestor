import { BigNumber } from 'ethers';
import { mutate, query } from '~amplifyClient';
import {
  ColonyMotion,
  CreateMotionMessageDocument,
  CreateMotionMessageInput,
  GetColonyActionByMotionIdDocument,
  GetColonyActionByMotionIdQuery,
  GetColonyActionByMotionIdQueryVariables,
  GetColonyMotionDocument,
  GetColonyMotionQuery,
  GetColonyMotionQueryVariables,
  UpdateColonyActionDocument,
  UpdateColonyMotionDocument,
} from '~graphql';
import { MotionSide, MotionVote } from '~types';
import { notNull, verbose } from '~utils';

export * from './motionStaked/helpers';

export const getMotionSide = (vote: BigNumber): MotionSide =>
  vote.eq(MotionVote.YAY) ? MotionSide.YAY : MotionSide.NAY;

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

    const colonyActionItems =
      data?.getColonyActionByMotionId?.items.filter(notNull);

    if (!colonyActionItems?.length) {
      verbose(
        'Could not find the action in the db. This is a bug and needs investigating.',
      );
    } else {
      await mutate(UpdateColonyActionDocument, {
        input: {
          id: colonyActionItems[0].id,
          showInActionsList,
        },
      });
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
    verbose(
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
