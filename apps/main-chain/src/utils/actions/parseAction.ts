import { utils } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';
import { SIMPLE_DECISIONS_ACTION_CODE } from '~constants';
import { ColonyOperations } from '~types';
import { parseFunctionData } from '~utils/parseFunction';

export interface SimpleTransactionDescription {
  name: ColonyOperations.SimpleDecision;
}

export const parseMotionAction = (
  action: string,
  interfaces: utils.Interface[],
): TransactionDescription | SimpleTransactionDescription | null => {
  if (action === SIMPLE_DECISIONS_ACTION_CODE) {
    return {
      name: ColonyOperations.SimpleDecision,
    };
  }

  return parseFunctionData(action, interfaces);
};
