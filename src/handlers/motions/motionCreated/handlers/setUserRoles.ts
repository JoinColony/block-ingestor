import { TransactionDescription } from 'ethers/lib/utils';

import { ContractEvent, motionNameMapping } from '~types';
import { getDomainDatabaseId, getRolesMapFromHexString } from '~utils';

import { createMotionInDB } from '../helpers';

export const handleSetUserRolesMotion = async (
  event: ContractEvent,
  parsedAction: TransactionDescription,
): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { name, args: actionArgs } = parsedAction;
  const [userAddress, domainId, zeroPadHexString] = actionArgs.slice(-3);
  const roles = getRolesMapFromHexString(zeroPadHexString);

  await createMotionInDB(event, {
    type: motionNameMapping[name],
    fromDomainId: getDomainDatabaseId(colonyAddress, domainId),
    recipientAddress: userAddress,
    roles,
  });
};
