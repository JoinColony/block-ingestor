import { Result } from 'ethers/lib/utils';
import { mutate, query } from '~amplifyClient';
import {
  ColonyActionType,
  GetExpenditureByNativeFundingPotIdAndColonyDocument,
  GetExpenditureByNativeFundingPotIdAndColonyQuery,
  GetExpenditureByNativeFundingPotIdAndColonyQueryVariables,
  UpdateExpenditureDocument,
  UpdateExpenditureMutation,
  UpdateExpenditureMutationVariables,
} from '~graphql';
import { createMotionInDB } from '~handlers/motions/motionCreated/helpers';
import { ContractEvent } from '~types';
import { getVotingClient, notNull, toNumber } from '~utils';

export const moveFundsBetweenPotsMulti = async ({
  event,
  args: moveFundsArgs,
  gasEstimate,
}: {
  event: ContractEvent;
  args: Result;
  gasEstimate: string;
}): Promise<void> => {
  const { colonyAddress } = event;

  // ethers arrays contain the param names as keys as well, not just numeric indices
  const { _toPot } = moveFundsArgs;

  if (!colonyAddress) {
    return;
  }

  const { data } =
    (await query<
      GetExpenditureByNativeFundingPotIdAndColonyQuery,
      GetExpenditureByNativeFundingPotIdAndColonyQueryVariables
    >(GetExpenditureByNativeFundingPotIdAndColonyDocument, {
      nativeFundingPotId: toNumber(_toPot),
      colonyAddress,
    })) ?? {};

  const expenditure =
    data?.getExpendituresByNativeFundingPotIdAndColony?.items.filter(
      notNull,
    )[0];

  /*
   * The only motion that currently calls moveFundsBetweenPots via multicall is the
   * fund expenditures motion. If that ever changes, here is where you could implement an altenative control flow.
   * Also, since this handler may be called multiple times for the same expenditure, if we have already
   * associated a funding motion with the expenditure, we don't need to do it again.
   */
  if (!expenditure || expenditure.fundingMotionId) {
    return;
  }

  const votingClient = await getVotingClient(colonyAddress);

  if (!votingClient) {
    return;
  }

  const motionMutationResponse = await createMotionInDB(event, {
    type: ColonyActionType.FundExpenditureMotion,
    gasEstimate,
  });

  const databaseMotionId = motionMutationResponse?.data?.createColonyMotion?.id;
  const expenditureId = expenditure.id;

  if (!expenditureId) {
    return;
  }

  await mutate<UpdateExpenditureMutation, UpdateExpenditureMutationVariables>(
    UpdateExpenditureDocument,
    { input: { id: expenditureId, fundingMotionId: databaseMotionId } },
  );
};
