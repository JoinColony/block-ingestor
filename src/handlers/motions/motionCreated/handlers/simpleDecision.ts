import { BigNumber } from 'ethers';

import { ContractEvent, motionNameMapping } from '~types';
import { SimpleTransactionDescription } from '~utils/actions/parseAction';
import { getColonyDecisionId } from '~utils/decisions';

import { createMotionInDB } from '../helpers';

export const handleSimpleDecisionMotion = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: SimpleTransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const { transactionHash } = event;

  const { name } = parsedAction;

  await createMotionInDB(colonyAddress, event, {
    type: motionNameMapping[name],
    colonyDecisionId: getColonyDecisionId(colonyAddress, transactionHash),
    gasEstimate: gasEstimate.toString(),
  });
};
