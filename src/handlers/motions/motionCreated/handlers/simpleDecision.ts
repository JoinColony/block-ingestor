import { ContractEvent, motionNameMapping } from '~types';
import { SimpleTransactionDescription, createMotionInDB } from '../helpers';
import { getColonyDecisionId } from '~utils/decisions';

export const handleSimpleDecisionMotion = async (
  event: ContractEvent,
  parsedAction: SimpleTransactionDescription,
): Promise<void> => {
  const { colonyAddress, transactionHash } = event;
  if (!colonyAddress) {
    return;
  }

  const { name } = parsedAction;

  await createMotionInDB(event, {
    type: motionNameMapping[name],
    colonyDecisionId: getColonyDecisionId(colonyAddress, transactionHash),
  });
};
