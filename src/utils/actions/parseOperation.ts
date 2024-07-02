import {
  AnyColonyClient,
  AnyOneTxPaymentClient,
  AnyStagedExpenditureClient,
  AnyStakedExpenditureClient,
} from '@colony/colony-js';
import { TransactionDescription } from 'ethers/lib/utils';
import { SIMPLE_DECISIONS_ACTION_CODE } from '~constants';
import { ColonyOperations } from '~types';
import { verbose } from '~utils/logger';

interface MotionActionClients {
  colonyClient?: AnyColonyClient | null;
  oneTxPaymentClient?: AnyOneTxPaymentClient | null;
  stakedExpenditureClient?: AnyStakedExpenditureClient | null;
  stagedExpenditureClient?: AnyStagedExpenditureClient | null;
}

export interface SimpleTransactionDescription {
  name: ColonyOperations.SimpleDecision;
}

export const parseOperation = (
  operation: string,
  clients: MotionActionClients,
): TransactionDescription | SimpleTransactionDescription | undefined => {
  if (operation === SIMPLE_DECISIONS_ACTION_CODE) {
    return {
      name: ColonyOperations.SimpleDecision,
    };
  }

  for (const key in clients) {
    const client = clients[key as keyof MotionActionClients];
    if (!client) {
      continue;
    }
    // Return the first time a client can successfully parse the motion
    try {
      return client.interface.parseTransaction({
        data: operation,
      });
    } catch {
      continue;
    }
  }

  verbose(`Unable to parse ${operation}`);
  return undefined;
};
