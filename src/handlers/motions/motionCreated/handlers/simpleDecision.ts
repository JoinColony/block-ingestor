import { ContractEvent, motionNameMapping } from '~types';
import { getColonyDecisionId } from '~utils/decisions';

import { SimpleTransactionDescription, createMotionInDB } from '../helpers';

export const handleSimpleDecisionMotion = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: SimpleTransactionDescription,
): Promise<void> => {
  const { transactionHash } = event;

  const { name } = parsedAction;

  await createMotionInDB(colonyAddress, event, {
    type: motionNameMapping[name],
    colonyDecisionId: getColonyDecisionId(colonyAddress, transactionHash),
  });
};
