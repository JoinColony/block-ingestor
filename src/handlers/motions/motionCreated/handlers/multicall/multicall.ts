import { TransactionDescription } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';
import { getCachedColonyClient } from '~utils';
import { multicallFragments } from './fragments';
import { ContractEvent } from '~types';

export const handleMulticallMotion = async (
  event: ContractEvent,
  parsedAction: TransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const { colonyAddress = '' } = event ?? {};
  const colonyClient = await getCachedColonyClient(colonyAddress);

  if (!colonyClient) {
    return;
  }

  // Multicall takes an array of an array of encoded actions.
  const encodedActions = parsedAction.args[0];

  // Multicall can have an arbitrary number of underlying actions. Difficult to predict in advance how much
  // gas executing this action will consume. Let's start by assuming 100k gas per action.
  const updatedGasEstimate = gasEstimate
    .add(BigNumber.from(encodedActions.length ?? 0).mul(100000))
    .toString();

  // For each encoded action, we need to decode it and execute the appropriate handler.
  // This can only be done by trying to decode the action with each of the function signatures we know use multicall.
  for (const arg of parsedAction.args[0]) {
    for (const [fragment, handler] of multicallFragments) {
      try {
        // These are the arguments passed to the underlying action.
        const decodedArgs = colonyClient.interface.decodeFunctionData(
          fragment,
          arg,
        );

        await handler({
          event,
          args: decodedArgs,
          gasEstimate: updatedGasEstimate,
        });
        // if decode is successful, we can move on to the next argument.
        break;
      } catch {
        // silent. We are expecting all but one of the fragments to error for each arg.
      }
    }
  }
};
