import { constants } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';
import { query } from '~amplifyClient';
import {
  GetColonyRoleDocument,
  GetColonyRoleQuery,
  GetColonyRoleQueryVariables,
} from '~graphql';

import { ContractEvent, multiSigNameMapping } from '~types';
import {
  createColonyHistoricRoleDatabaseEntry,
  getColonyRolesDatabaseId,
  getDomainDatabaseId,
  getRolesMapFromHexString,
} from '~utils';
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
  const isMultiSig = actionTarget !== constants.AddressZero;

  const { blockNumber } = event;

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

  const {
    id: existingColonyRoleId,
    latestBlock: existingColonyRoleLatestBlock = 0,
    /*
     * We need to extract __typename since the `existingRoles` object will get
     * Passed down to another mutation and typenames will clash
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __typename,
    ...existingRoles
  } = (
    await query<GetColonyRoleQuery, GetColonyRoleQueryVariables>(
      GetColonyRoleDocument,
      { id: colonyRolesDatabaseId },
    )
  )?.data?.getColonyRole ?? {};

  // only create a historic role if it's not the first assignment of roles
  if (existingColonyRoleId && blockNumber > existingColonyRoleLatestBlock) {
    await createColonyHistoricRoleDatabaseEntry(
      colonyAddress,
      domainId.toNumber(),
      userAddress,
      blockNumber,
      {
        ...existingRoles,
        ...roles,
      },
      isMultiSig,
    );
  }

  await createMultiSigInDB(colonyAddress, event, {
    type: multiSigNameMapping[name],
    fromDomainId: getDomainDatabaseId(colonyAddress, domainId),
    recipientAddress: userAddress,
    roles,
    rolesAreMultiSig: isMultiSig ? true : null,
  });
};
