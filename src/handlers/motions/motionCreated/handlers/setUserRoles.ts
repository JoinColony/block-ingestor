import { TransactionDescription } from 'ethers/lib/utils';
import { BigNumber, constants } from 'ethers';

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
  altTarget: string,
): Promise<void> => {
  const { colonyAddress } = event;
  if (!colonyAddress) {
    return;
  }

  const isMultiSig = altTarget !== constants.AddressZero;

  const { name, args: actionArgs } = parsedAction;
  const [userAddress, domainId, zeroPadHexString] = actionArgs.slice(-3);
  const colonyRolesDatabaseId = getColonyRolesDatabaseId(
    colonyAddress,
    domainId,
    userAddress,
    isMultiSig,
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
    rolesAreMultiSig: isMultiSig ? true : null,
    gasEstimate: gasEstimate.toString(),
  });
};
