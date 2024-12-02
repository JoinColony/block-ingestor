import { TransactionDescription } from 'ethers/lib/utils';
import { constants } from 'ethers';

import { motionNameMapping } from '~types';
import { getDomainDatabaseId, getRolesMapFromHexString } from '~utils';

import { createMotionInDB } from '../helpers';
import { ContractEvent } from '@joincolony/blocks';

export const handleSetUserRolesMotion = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
  altTarget: string,
): Promise<void> => {
  const isMultiSig = altTarget !== constants.AddressZero;

  const { name, args: actionArgs } = parsedAction;
  const [userAddress, domainId, zeroPadHexString] = actionArgs.slice(-3);
  const roles = getRolesMapFromHexString(zeroPadHexString);

  await createMotionInDB(colonyAddress, event, {
    type: motionNameMapping[name],
    fromDomainId: getDomainDatabaseId(colonyAddress, domainId),
    recipientAddress: userAddress,
    roles,
    rolesAreMultiSig: isMultiSig ? true : null,
  });
};
