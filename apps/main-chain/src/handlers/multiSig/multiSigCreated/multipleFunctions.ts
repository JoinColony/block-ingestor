import { utils } from 'ethers';
import { ContractEvent } from '@joincolony/blocks';
import {
  decodeFunctions,
  getCachedColonyClient,
  getMultiSigClient,
  getOneTxPaymentClient,
  getStagedExpenditureClient,
  getStakedExpenditureClient,
} from '~utils';
import { multipleFunctionsHandlers } from './handlers/multipleFunctionsHandlers';
import { output } from '@joincolony/utils';

interface HandleMultisigMultipleFunctionsParams {
  event: ContractEvent;
  colonyAddress: string;
  actionData: string[];
  actionTargets: string[];
}

export const handleMultisigMultipleFunctions = async ({
  event,
  colonyAddress,
  actionData,
}: HandleMultisigMultipleFunctionsParams): Promise<void> => {
  const colonyClient = await getCachedColonyClient(colonyAddress);
  const multiSigClient = await getMultiSigClient(colonyAddress);

  if (!colonyClient || !multiSigClient) {
    return;
  }

  const oneTxPaymentClient = await getOneTxPaymentClient(colonyAddress);

  const stakedExpenditureClient = await getStakedExpenditureClient(
    colonyAddress,
  );

  const stagedExpenditureClient = await getStagedExpenditureClient(
    colonyAddress,
  );

  /**
   * @NOTE: This is not good, we should use ABIs from @colony/abis instead.
   * It would avoid having to make network calls each time the motion is created
   */
  const interfaces = [
    colonyClient.interface,
    oneTxPaymentClient?.interface,
    stakedExpenditureClient?.interface,
    stagedExpenditureClient?.interface,
  ].filter(Boolean) as utils.Interface[];

  const decodedFunctions = decodeFunctions(actionData, interfaces);

  if (decodedFunctions.length === 0) {
    return;
  }

  for (const [validator, handler] of multipleFunctionsHandlers) {
    if (validator({ decodedFunctions })) {
      await handler({
        colonyAddress,
        event,
        decodedFunctions,
      });

      return;
    }
  }

  output('No handler found for multiple functions multisig');
};
