import { TransactionDescription } from 'ethers/lib/utils';

import { ContractEvent, multiSigNameMapping } from '~types';
import { getColonyRolesDatabaseId, getRolesMapFromHexString } from '~utils';
import { createMultiSigInDB } from '../helpers';

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

  await createMultiSigInDB(colonyAddress, event, {
    type: multiSigNameMapping[name],
    recipientAddress: userAddress,
    roles,
    rolesAreMultiSig: isMultiSig ? true : null,
  });
};
