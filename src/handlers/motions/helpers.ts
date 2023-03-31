import { BigNumber } from 'ethers';
import { mutate, query } from '~amplifyClient';
import { MotionData, MotionQuery, MotionSide, MotionVote } from '~types';
import { verbose } from '~utils';

export * from './motionStaked/helpers';

export const getMotionSide = (vote: BigNumber): MotionSide =>
  vote.eq(MotionVote.YAY) ? MotionSide.YAY : MotionSide.NAY;

export const updateMotionInDB = async (
  id: string,
  motionData: MotionData,
): Promise<void> => {
  await mutate('updateColonyAction', {
    input: {
      id,
      motionData,
    },
  });
};

/*
 * Motion ids are not unique between voting reputation installations. If you had a motion with id of 1
 * in a previous voting reputation installation, you will get another one after uninstalling and reinstalling
 * the voting reputation client. So, we only want the one created most recently, since that's the one created
 * by the currently installed version of the voting reputation extension.
 */

export const getMotionFromDB = async (
  colonyAddress: string,
  databaseMotionId: string,
): Promise<MotionQuery | undefined> => {
  const { items: motions } =
    (await query<{ items: MotionQuery[] }>('getColonyMotions', {
      colonyAddress,
    })) ?? {};

  if (!motions) {
    verbose(
      'Could not query motions in the db. This is a bug and needs investigating.',
    );

    return undefined;
  }

  const motion = motions.find(
    ({ motionData: { motionId } }) => motionId === databaseMotionId,
  );

  if (!motion) {
    verbose(
      'Could not find the motion in the db. This is a bug and needs investigating.',
    );
  }

  return motion;
};
