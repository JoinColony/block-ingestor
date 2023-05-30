import { BigNumber } from 'ethers';
import { mutate, query } from '~amplifyClient';
import { ColonyMotion, MotionMessage, MotionSide, MotionVote } from '~types';
import { verbose } from '~utils';

export * from './motionStaked/helpers';

export const getMotionSide = (vote: BigNumber): MotionSide =>
  vote.eq(MotionVote.YAY) ? MotionSide.YAY : MotionSide.NAY;

export const updateMotionInDB = async (
  motionData: ColonyMotion,
  newMotionMessages?: MotionMessage[],
  showInActionsList?: boolean,
): Promise<void> => {
  await mutate('updateColonyMotion', {
    input: {
      ...motionData,
    },
  });

  if (newMotionMessages?.length) {
    for (const message of newMotionMessages) {
      await mutate('createMotionMessage', {
        input: {
          ...message,
        },
      });
    }
  }

  if (showInActionsList !== undefined) {
    const { items: colonyActionItems } =
      (await query<{ items: Array<{ id: string }> }>('getColonyActionByMotionId', {
        motionId: motionData.id,
      })) ?? {};

    if (!colonyActionItems?.length) {
      verbose(
        'Could not find the action in the db. This is a bug and needs investigating.',
      );
    } else {
      await mutate('updateColonyAction', {
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
): Promise<ColonyMotion | undefined> => {
  const motion =
    await query<ColonyMotion>('getColonyMotion', {
      id: databaseMotionId,
    });

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
