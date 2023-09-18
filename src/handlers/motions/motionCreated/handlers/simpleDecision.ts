import { BigNumber } from 'ethers';

import { ContractEvent, motionNameMapping } from '~types';
import { getColonyDecisionId } from '~utils/decisions';

import { SimpleTransactionDescription, createMotionInDB } from '../helpers';

export const handleSimpleDecisionMotion = async (
  event: ContractEvent,
  parsedAction: SimpleTransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const { colonyAddress, transactionHash } = event;
  if (!colonyAddress) {
    return;
  }

  const { name } = parsedAction;

  await createMotionInDB(event, {
    type: motionNameMapping[name],
    colonyDecisionId: getColonyDecisionId(colonyAddress, transactionHash),
    gasEstimate: gasEstimate.toString(),
  });
};
