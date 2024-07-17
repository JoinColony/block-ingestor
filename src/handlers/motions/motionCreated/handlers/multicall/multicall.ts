import { Result, TransactionDescription } from 'ethers/lib/utils';
import { BigNumber, utils } from 'ethers';
import {
  getCachedColonyClient,
  getStreamingPaymentsClient,
  output,
} from '~utils';
import { ContractEvent, ContractMethodSignatures } from '~types';
import { AnyColonyClient, AnyStreamingPaymentsClient } from '@colony/colony-js';
import { multicallHandlers } from './multicallHandlers';

/**
 * @NOTE: This is a rather rudimentary way of handling multicall motions
 * which only works for multicalls created by UI sagas.
 * It should be refactored as part of https://github.com/JoinColony/colonyCDapp/issues/2317
 */

// List all supported multicall functions
export const supportedMulticallFunctions: ContractMethodSignatures[] = [
  ContractMethodSignatures.MoveFundsBetweenPots,
  ContractMethodSignatures.SetExpenditureState,
  ContractMethodSignatures.SetExpenditurePayout,
];

export const supportedStreamingPaymentMulticall: ContractMethodSignatures[] = [
  ContractMethodSignatures.SetTokenAmount,
  ContractMethodSignatures.SetStartTime,
  ContractMethodSignatures.SetEndTime,
];

export interface DecodedFunction {
  functionSignature: ContractMethodSignatures;
  args: Result;
}

const decodeFunctions = (
  encodedFunctions: utils.Result,
  colonyClient: AnyColonyClient,
  streamingPaymentsClient: AnyStreamingPaymentsClient | null,
): DecodedFunction[] => {
  const decodedFunctions: DecodedFunction[] = [];
  for (const functionCall of encodedFunctions) {
    supportedMulticallFunctions.forEach((fragment) => {
      try {
        const decodedArgs = colonyClient.interface.decodeFunctionData(
          fragment,
          functionCall,
        );
        decodedFunctions.push({
          functionSignature: fragment,
          args: decodedArgs,
        });
      } catch {
        // silent. We are expecting all but one of the fragments to error for each arg.
      }
    });
    if (streamingPaymentsClient) {
      supportedStreamingPaymentMulticall.forEach((fragment) => {
        try {
          const decodedArgs =
            streamingPaymentsClient.interface.decodeFunctionData(
              fragment,
              functionCall,
            );
          decodedFunctions.push({
            functionSignature: fragment,
            args: decodedArgs,
          });
        } catch {
          // silent. We are expecting all but one of the fragments to error for each arg.
        }
      });
    }
  }

  return decodedFunctions;
};

export const handleMulticallMotion = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const colonyClient = await getCachedColonyClient(colonyAddress);
  const streamingPaymentsClient = await getStreamingPaymentsClient(
    colonyAddress,
  );

  if (!colonyClient) {
    return;
  }

  // Multicall takes an array of an array of encoded function calls
  const encodedFunctions = parsedAction.args[0];

  // Multicall can have an arbitrary number of underlying function calls. Difficult to predict in advance how much
  // gas executing this action will consume. Let's start by assuming 100k gas per action.
  const updatedGasEstimate = gasEstimate
    .add(BigNumber.from(encodedFunctions.length ?? 0).mul(100000))
    .toString();

  // We need to determine which multicallMotion this is and pass it to the appropriate handler
  const decodedFunctions = decodeFunctions(
    encodedFunctions,
    colonyClient,
    streamingPaymentsClient,
  );

  for (const [validator, handler] of multicallHandlers) {
    if (validator({ decodedFunctions })) {
      handler({
        colonyAddress,
        event,
        decodedFunctions,
        gasEstimate: updatedGasEstimate,
      });

      return;
    }
  }

  output('No handler found for multicall motion');
};
