import { TransactionDescription } from 'ethers/lib/utils';

import { ContractEvent, multiSigNameMapping } from '~types';
import { getDomainDatabaseId, getRolesMapFromHexString } from '~utils';
import { createMultiSigInDB } from '../helpers';
import { sendMentionNotifications } from '~utils/notifications';

export const handleSetUserRolesMultiSig = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
  actionTarget: string,
): Promise<void> => {
  if (!colonyAddress) {
    return;
  }
  // When setting 'Own' authority, the action target will be the colonyAddress
  // When setting 'Multisig' authority, the action target will be the multisig extension address
  const isMultiSig = actionTarget !== colonyAddress;

  const { name, args: actionArgs } = parsedAction;
  const [userAddress, domainId, zeroPadHexString] = actionArgs.slice(-3);

  const roles = getRolesMapFromHexString(zeroPadHexString);

  await createMultiSigInDB(colonyAddress, event, {
    type: multiSigNameMapping[name],
    fromDomainId: getDomainDatabaseId(colonyAddress, domainId),
    recipientAddress: userAddress,
    roles,
    rolesAreMultiSig: isMultiSig ? true : null,
  });

  sendMentionNotifications({
    colonyAddress,
    creator: event.args.agent,
    transactionHash: event.transactionHash,
    recipients: [userAddress],
  });
};
