import { TransactionDescription } from 'ethers/lib/utils';
import { BigNumber, constants } from 'ethers';

import { ContractEvent, motionNameMapping } from '~types';
import {
  createColonyHistoricRoleDatabaseEntry,
  getColonyRolesDatabaseId,
  getDomainDatabaseId,
  getRolesMapFromHexString,
} from '~utils';

import { createMotionInDB } from '../helpers';
import { query } from '~amplifyClient';
import {
  GetColonyRoleDocument,
  GetColonyRoleQuery,
  GetColonyRoleQueryVariables,
} from '~graphql';

export const handleSetUserRolesMotion = async (
  colonyAddress: string,
  event: ContractEvent,
  parsedAction: TransactionDescription,
  gasEstimate: BigNumber,
  altTarget: string,
): Promise<void> => {
  const isMultiSig = altTarget !== constants.AddressZero;

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

  await createMotionInDB(colonyAddress, event, {
    type: motionNameMapping[name],
    fromDomainId: getDomainDatabaseId(colonyAddress, domainId),
    recipientAddress: userAddress,
    roles,
    rolesAreMultiSig: isMultiSig ? true : null,
    gasEstimate: gasEstimate.toString(),
  });
};
