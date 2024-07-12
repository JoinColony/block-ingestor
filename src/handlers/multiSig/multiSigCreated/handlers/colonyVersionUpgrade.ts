import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent, multiSigNameMapping } from '~types';
import { createMultiSigInDB } from '../helpers';

export const colonyVersionUpgrade = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  if (!colonyAddress) {
    return;
  }

  const { name, args: actionArgs } = parsedAction;

  //   const newColonyVersion = actionArgs[1].toString();

  console.log('ROMEO ACTION ARGS: ', actionArgs);

  await createMultiSigInDB(colonyAddress, event, {
    type: multiSigNameMapping[name],
    // newColonyVersion,
  });
};
