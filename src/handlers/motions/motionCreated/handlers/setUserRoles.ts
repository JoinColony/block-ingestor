import { TransactionDescription } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

import { ContractEvent, motionNameMapping } from '~types';
import {
  getColonyRolesDatabaseId,
  getDomainDatabaseId,
  getRolesMapFromHexString,
} from '~utils';

import { createMotionInDB } from '../helpers';

export const handleSetUserRolesMotion = async (
  event: ContractEvent,
  parsedAction: TransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const { colonyAddress } = event;
  if (!colonyAddress) {
    return;
  }

  const { name, args: actionArgs } = parsedAction;
  const [userAddress, domainId, zeroPadHexString] = actionArgs.slice(-3);
  const colonyRolesDatabaseId = getColonyRolesDatabaseId(
    colonyAddress,
    domainId,
    userAddress,
  );
  const roles = await getRolesMapFromHexString(
    zeroPadHexString,
    colonyRolesDatabaseId,
  );

  await createMotionInDB(event, {
    type: motionNameMapping[name],
    fromDomainId: getDomainDatabaseId(colonyAddress, domainId),
    recipientAddress: userAddress,
    roles,
    gasEstimate: gasEstimate.toString(),
  });
};
