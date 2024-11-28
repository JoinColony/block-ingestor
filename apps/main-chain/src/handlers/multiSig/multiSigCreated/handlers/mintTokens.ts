import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, multiSigNameMapping } from '~types';
import { getColonyTokenAddress } from '~utils';
import { createMultiSigInDB } from '../helpers';

export const handleMintTokensMultiSig = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  const { blockNumber } = event;
  if (!colonyAddress) {
    return;
  }

  const { name, args: actionArgs } = parsedAction;
  const amount = actionArgs[0].toString();
  const tokenAddress = await getColonyTokenAddress(colonyAddress, blockNumber);

  await createMultiSigInDB(colonyAddress, event, {
    type: multiSigNameMapping[name],
    tokenAddress,
    amount,
  });
};
