import { ContractEvent, multiSigNameMapping } from '~types';
import { SimpleTransactionDescription } from '~utils';
import { getColonyDecisionId } from '~utils/decisions';

import { createMultiSigInDB } from '../helpers';

export const handleSimpleDecisionMultiSig = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: SimpleTransactionDescription,
): Promise<void> => {
  const { transactionHash } = event;

  const { name } = parsedAction;

  await createMultiSigInDB(colonyAddress, event, {
    type: multiSigNameMapping[name],
    colonyDecisionId: getColonyDecisionId(colonyAddress, transactionHash),
  });
};
