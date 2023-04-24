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
  showInActionsList?: boolean,
): Promise<void> => {
  await mutate('updateColonyAction', {
    input: {
      id,
      motionData,
      ...(showInActionsList === undefined ? {} : { showInActionsList }),
    },
  });
};

export const getMotionDatabaseId = (
  chainId: number,
  votingRepExtnAddress: string,
  nativeMotionId: BigNumber,
): string => `${chainId}-${votingRepExtnAddress}_${nativeMotionId}`;

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
