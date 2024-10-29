import { ColonyActionType, ExpenditureFundingItem } from '~graphql';
import { ContractMethodSignatures } from '~types';
import { getExpenditureByFundingPot } from '~utils/expenditures';
import { toNumber } from '~utils/numbers';
import { createMultiSigInDB } from '../../helpers';
import { MultipleFunctionsHandler, MultipleFunctionsValidator } from './types';

export const isFundExpenditureMultisig: MultipleFunctionsValidator = ({
  decodedFunctions,
}) => {
  return decodedFunctions.every(
    (decodedFunction) =>
      decodedFunction.signature ===
      ContractMethodSignatures.MoveFundsBetweenPots,
  );
};

// for the moment this just does the same as the motion one, let's see how it evolves :')
export const fundExpenditureMultisigHandler: MultipleFunctionsHandler = async ({
  colonyAddress,
  event,
  decodedFunctions,
}) => {
  const targetPotId = decodedFunctions[0]?.args._toPot;

  const expenditure = await getExpenditureByFundingPot(
    colonyAddress,
    toNumber(targetPotId),
  );
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

  await createMultiSigInDB(colonyAddress, event, {
    type: ColonyActionType.FundExpenditureMultisig,
    expenditureId: expenditure.id,
    expenditureFunding: fundingItems,
  });
};
