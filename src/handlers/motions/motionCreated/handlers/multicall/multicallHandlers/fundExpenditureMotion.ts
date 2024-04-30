import { Result } from 'ethers/lib/utils';
import { query } from '~amplifyClient';
import {
  ColonyActionType,
  GetExpenditureByNativeFundingPotIdAndColonyDocument,
  GetExpenditureByNativeFundingPotIdAndColonyQuery,
  GetExpenditureByNativeFundingPotIdAndColonyQueryVariables,
} from '~graphql';
import { createMotionInDB } from '~handlers/motions/motionCreated/helpers';
import { ContractEvent, ContractMethodSignatures } from '~types';
import { notNull, toNumber } from '~utils';
import { MulticallHandler, MulticallValidator } from './types';

export const isFundExpenditureMotion: MulticallValidator = ({
  decodedFunctions,
}) => {
  return decodedFunctions.every(
    (decodedFunction) =>
      decodedFunction.functionSignature ===
      ContractMethodSignatures.MoveFundsBetweenPots,
  );
};

export const fundExpenditureMotionHandler: MulticallHandler = ({
  event,
  decodedFunctions,
  gasEstimate,
}) => {
  decodedFunctions.forEach((decodedFunction) => {
    moveFundsBetweenPotsMulti({
      event,
      args: decodedFunction.args,
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

  const expenditureId = expenditure.id;

  await createMotionInDB(event, {
    type: ColonyActionType.FundExpenditureMotion,
    gasEstimate,
    expenditureId,
  });
};
