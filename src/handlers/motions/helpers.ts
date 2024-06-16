import { BigNumber } from 'ethers';
import { mutate, query } from '~amplifyClient';
import {
  ColonyMotion,
  CreateMotionMessageDocument,
  CreateMotionMessageInput,
  GetColonyMotionDocument,
  GetColonyMotionQuery,
  GetColonyMotionQueryVariables,
  UpdateColonyActionDocument,
  UpdateColonyMotionDocument,
} from '~graphql';
import { MotionSide, MotionVote } from '~types';
import { verbose, output } from '~utils';
import { getActionByMotionId } from '~utils/actions';
import { updateDecisionInDB } from '~utils/decisions';

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
    const colonyAction = await getActionByMotionId(motionData.id);

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
