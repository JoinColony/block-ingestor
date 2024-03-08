import { Result } from 'ethers/lib/utils';
import { query } from '~amplifyClient';
import {
  ColonyActionType,
  GetExpenditureByNativeFundingPotIdAndColonyDocument,
  GetExpenditureByNativeFundingPotIdAndColonyQuery,
  GetExpenditureByNativeFundingPotIdAndColonyQueryVariables,
} from '~graphql';
import { createMotionInDB } from '~handlers/motions/motionCreated/helpers';
import { ContractEvent } from '~types';
import { getVotingClient, notNull, toNumber } from '~utils';
import { DecodedFunctions } from '../multicall';

export const isFundExpenditureMotion = (
  decodedFunctions: DecodedFunctions,
): boolean => {
  const fragmentsToMatch = [
    'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,address)',
    'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,address)',
  ];
  return decodedFunctions.every((decodedFunction) =>
    fragmentsToMatch.includes(decodedFunction.fragment),
  );
};

export const fundExpenditureMotionHandler = (
  event: ContractEvent,
  decodedFunctions: DecodedFunctions,
  gasEstimate: string,
): void => {
  decodedFunctions.forEach((decodedFunction) => {
    moveFundsBetweenPotsMulti({
      event,
      args: decodedFunction.decodedAction,
      gasEstimate,
    });
  });
};

const moveFundsBetweenPotsMulti = async ({
  event,
  args: moveFundsArgs,
  gasEstimate,
}: {
  event: ContractEvent;
  args: Result;
  gasEstimate: string;
}): Promise<void> => {
  const { colonyAddress, transactionHash } = event;

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
  const existingFundMotions = new Set(
    expenditure?.motions?.items
      ?.filter(notNull)
      .filter(
        ({ action }) => action?.type === ColonyActionType.FundExpenditureMotion,
      )
      .map(({ transactionHash }) => transactionHash) ?? [],
  );

  if (!expenditure || existingFundMotions.has(transactionHash)) {
    return;
  }

  const votingClient = await getVotingClient(colonyAddress);

  if (!votingClient) {
    return;
  }

  const expenditureId = expenditure.id;

  await createMotionInDB(event, {
    type: ColonyActionType.FundExpenditureMotion,
    gasEstimate,
    expenditureId,
  });
};
