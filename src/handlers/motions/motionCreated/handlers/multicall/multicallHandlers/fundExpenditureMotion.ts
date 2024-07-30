import { query } from '~amplifyClient';
import {
  ColonyActionType,
  ExpenditureFundingItem,
  GetExpenditureByNativeFundingPotIdAndColonyDocument,
  GetExpenditureByNativeFundingPotIdAndColonyQuery,
  GetExpenditureByNativeFundingPotIdAndColonyQueryVariables,
} from '~graphql';
import { createMotionInDB } from '~handlers/motions/motionCreated/helpers';
import { ContractMethodSignatures } from '~types';
import { notNull, toNumber } from '~utils';
import { MulticallHandler, MulticallValidator } from './types';

export const isFundExpenditureMotion: MulticallValidator = ({
  decodedFunctions,
}) => {
  return decodedFunctions.every(
    (decodedFunction) =>
      decodedFunction.signature ===
      ContractMethodSignatures.MoveFundsBetweenPots,
  );
};

export const fundExpenditureMotionHandler: MulticallHandler = async ({
  colonyAddress,
  event,
  decodedFunctions,
  gasEstimate,
}) => {
  // @NOTE: We get the target pot ID from the first multicall function
  // This means if the multicall funds multiple expenditures, we will only create a motion for the first one
  const targetPotId = decodedFunctions[0]?.args._toPot;

  const response = await query<
    GetExpenditureByNativeFundingPotIdAndColonyQuery,
    GetExpenditureByNativeFundingPotIdAndColonyQueryVariables
  >(GetExpenditureByNativeFundingPotIdAndColonyDocument, {
    nativeFundingPotId: toNumber(targetPotId),
    colonyAddress,
  });

  const expenditure =
    response?.data?.getExpendituresByNativeFundingPotIdAndColony?.items.filter(
      notNull,
    )[0];
  if (!expenditure) {
    return;
  }

  const fundingItems: ExpenditureFundingItem[] = [];

  for (const decodedFunction of decodedFunctions) {
    if (
      decodedFunction.signature !==
        ContractMethodSignatures.MoveFundsBetweenPots ||
      decodedFunction.args._toPot !== targetPotId
    ) {
      continue;
    }

    fundingItems.push({
      amount: decodedFunction.args._amount.toString(),
      tokenAddress: decodedFunction.args._token,
    });
  }

  await createMotionInDB(colonyAddress, event, {
    type: ColonyActionType.FundExpenditureMotion,
    gasEstimate,
    expenditureId: expenditure.id,
    expenditureFunding: fundingItems,
  });
};
