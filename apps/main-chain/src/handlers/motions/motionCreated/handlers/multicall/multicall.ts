import { TransactionDescription } from 'ethers/lib/utils';
import { utils } from 'ethers';
import { decodeFunctions, getCachedColonyClient } from '~utils';
import { ContractEvent } from '@joincolony/blocks';
import { multicallHandlers } from './multicallHandlers';
import { output } from '@joincolony/utils';

export const handleMulticallMotion = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
  interfaces: utils.Interface[],
): Promise<void> => {
  const colonyClient = await getCachedColonyClient(colonyAddress);

  if (!colonyClient) {
    return;
  }

  // Multicall takes an array of an array of encoded function calls
  const encodedFunctions = parsedAction.args[0];

  // We need to determine which multicallMotion this is and pass it to the appropriate handler
  const decodedFunctions = decodeFunctions(encodedFunctions, interfaces);

  if (decodedFunctions.length === 0) {
    return;
  }

  for (const [validator, handler] of multicallHandlers) {
    if (validator({ decodedFunctions })) {
      handler({
        colonyAddress,
        event,
        decodedFunctions,
      });

      return;
    }
  }

  output('No handler found for multicall motion');
};
