import { BigNumber } from 'ethers';
import { mutate, query } from '~amplifyClient';
import { ColonyMotion, MotionSide, MotionVote } from '~types';
import { verbose } from '~utils';

export * from './motionStaked/helpers';

export const getMotionSide = (vote: BigNumber): MotionSide =>
  vote.eq(MotionVote.YAY) ? MotionSide.YAY : MotionSide.NAY;

export const updateMotionInDB = async (
  motionData: ColonyMotion,
  showInActionsList?: boolean,
): Promise<void> => {
  await mutate('updateColonyMotion', {
    input: {
      ...motionData,
    },
  });

  if (showInActionsList !== undefined) {
    const { items: colonyAction } =
      (await query<{ items: Array<{ id: string }> }>('getColonyActionByMotionId', {
        motionId: motionData.id,
      })) ?? {};

    if (!colonyAction?.length) {
      verbose(
        'Could not find the action in the db. This is a bug and needs investigating.',
      );
    } else {
      await mutate('updateColonyAction', {
        input: {
          id: colonyAction[0].id,
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
