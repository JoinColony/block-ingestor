import { TransactionDescription } from 'ethers/lib/utils';
import { multiSigNameMapping } from '~types';
import { createMultiSigInDB } from '../helpers';
import { getDomainDatabaseId } from '~utils';
import { sendMentionNotifications } from '~utils/notifications';
import { ContractEvent } from '@joincolony/blocks';

export const handleManageReputationMultiSig = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  if (!colonyAddress) {
    return;
  }

  const { name, args: actionArgs } = parsedAction;
  const [domainId, userAddress, amount] = actionArgs.slice(-3);
  await createMultiSigInDB(colonyAddress, event, {
    type: multiSigNameMapping[name],
    recipientAddress: userAddress,
    amount: amount.toString(),
    fromDomainId: getDomainDatabaseId(colonyAddress, domainId),
  });

  sendMentionNotifications({
    colonyAddress,
    creator: event.args.agent,
    transactionHash: event.transactionHash,
    recipients: [userAddress],
  });
};
