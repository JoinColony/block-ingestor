import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, multiSigNameMapping } from '~types';
import { argsByTypeToString, decodeArbitraryFunction } from '~utils';
import { createMultiSigInDB } from '../helpers';

export const handleMakeArbitraryTxsMultiSig = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  if (!colonyAddress) {
    return;
  }

  const { name } = parsedAction;
  const { _targets: contractAddresses, _actions: encodedFunctions } =
    parsedAction.args;

  const currentArbitraryTransactions = await Promise.all(
    contractAddresses.map(async (contractAddress: string, index: number) => {
      const currentEncodedFunction = encodedFunctions[index];
      const decodedFunction = await decodeArbitraryFunction(
        currentEncodedFunction,
      );
      const functionInputs = decodedFunction?.functionFragment.inputs;
      const functionArgs = decodedFunction?.args;

      const mappedArgs = functionInputs?.map((item, index) => {
        return {
          name: item.name,
          type: item.type,
          value: argsByTypeToString(functionArgs?.[index], item.type),
        };
      });
      return {
        contractAddress,
        method: decodedFunction?.name,
        methodSignature: decodedFunction?.signature,
        args: mappedArgs,
        encodedFunction: currentEncodedFunction,
      };
    }),
  );

  await createMultiSigInDB(colonyAddress, event, {
    type: multiSigNameMapping[name],
    arbitraryTransactions: currentArbitraryTransactions,
  });
};
