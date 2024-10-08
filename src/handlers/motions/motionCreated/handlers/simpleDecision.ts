import { ContractEvent, motionNameMapping } from '~types';
import { SimpleTransactionDescription } from '~utils';
import { getColonyDecisionId } from '~utils/decisions';

import { createMotionInDB } from '../helpers';

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
