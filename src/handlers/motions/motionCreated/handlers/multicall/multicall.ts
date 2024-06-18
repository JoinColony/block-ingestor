import { TransactionDescription } from 'ethers/lib/utils';
import { BigNumber, utils } from 'ethers';
import { getCachedColonyClient, output, parseFunctionData } from '~utils';
import { ContractEvent } from '~types';
import { multicallHandlers } from './multicallHandlers';

/**
 * @NOTE: This is a rather rudimentary way of handling multicall motions
 * which only works for multicalls created by UI sagas.
 * It should be refactored as part of https://github.com/JoinColony/colonyCDapp/issues/2317
 */

const decodeFunctions = (
  encodedFunctions: string[],
  interfaces: utils.Interface[],
): TransactionDescription[] => {
  const decodedFunctions: TransactionDescription[] = [];
  for (const functionCall of encodedFunctions) {
    const parsedFunction = parseFunctionData(functionCall, interfaces);
    if (!parsedFunction) {
      output(`Failed to parse multicall function: ${functionCall}`);
      continue;
    }

    decodedFunctions.push(parsedFunction);
  }

  return decodedFunctions;
};

export const handleMulticallMotion = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
  gasEstimate: BigNumber,
  interfaces: utils.Interface[],
): Promise<void> => {
  const colonyClient = await getCachedColonyClient(colonyAddress);

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
  const decodedFunctions = decodeFunctions(encodedFunctions, interfaces);

  if (decodedFunctions.length === 0) {
    return;
  }

  for (const [validator, handler] of multicallHandlers) {
    if (validator({ decodedFunctions })) {
      console.log({ decodedFunctions });
      console.log('Multicall handler found: ', handler.name);
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
