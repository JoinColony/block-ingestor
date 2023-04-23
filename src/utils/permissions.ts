/* eslint-disable @typescript-eslint/naming-convention */

import { ColonyRole, Id } from '@colony/colony-js';

import { mutate } from '~amplifyClient';
import { ContractEvent, ContractEventsSignatures } from '~types';

import {
  verbose,
  getCachedColonyClient,
  getDomainDatabaseId,
  mapLogToContractEvent,
} from '~utils';

export const getColonyRolesDatabaseId = (
  colonyAddress: string,
  nativeDomainId: number,
  userAddress: string,
): string => `${colonyAddress}_${nativeDomainId}_${userAddress}_roles`;

export const getColonyHistoricRolesDatabaseId = (
  colonyAddress: string,
  nativeDomainId: number,
  userAddress: string,
  blockNumber: number,
): string => `${colonyAddress}_${nativeDomainId}_${userAddress}_${blockNumber}_roles`;

export const getAllRoleEventsFromTransaction = async (
  transactionHash: string,
  colonyAddress: string,
): Promise<ContractEvent[]> => {
  const colonyRoleSetEventName = ContractEventsSignatures.ColonyRoleSet.slice(0, ContractEventsSignatures.ColonyRoleSet.indexOf('('));
  const colonyRecoveryRoleSetName = ContractEventsSignatures.RecoveryRoleSet.slice(0, ContractEventsSignatures.RecoveryRoleSet.indexOf('('));

  const colonyClient = await getCachedColonyClient(colonyAddress);
  const transactionReceipt = await colonyClient.provider.getTransactionReceipt(transactionHash);

  const events = await Promise.all(
    transactionReceipt.logs.map(log => mapLogToContractEvent(log, colonyClient.interface)),
  );

  const filteredEvents = events.filter(event => {
    if (
      !event ||
      !(event.name === colonyRoleSetEventName || event.name === colonyRecoveryRoleSetName)
    ) {
      return false;
    }
    return true;
  });

  /*
   * Typecasting since apparently TS doesn't realize we are actually filtering
   * to ensure that the Array only contains proper events
   */
  return filteredEvents as ContractEvent[];
};

export const createInitialColonyRolesDatabaseEntry = async (
  colonyAddress: string,
  nativeDomainId: number,
  userAddress: string,
  latestBlockNumber?: number,
): Promise<void> => {
  const rolesDatabaseId = getColonyRolesDatabaseId(colonyAddress, nativeDomainId, userAddress);
  const domainDatabaseId = getDomainDatabaseId(colonyAddress, nativeDomainId);

  const colonyClient = await getCachedColonyClient(colonyAddress);

  const recoveryRole = await colonyClient.hasUserRole(userAddress, nativeDomainId, ColonyRole.Recovery);
  const rootRole = await colonyClient.hasUserRole(userAddress, nativeDomainId, ColonyRole.Root);
  const arbitrationRole = await colonyClient.hasUserRole(userAddress, nativeDomainId, ColonyRole.Arbitration);
  const architectureRole = await colonyClient.hasUserRole(userAddress, nativeDomainId, ColonyRole.Architecture);
  const fundingRole = await colonyClient.hasUserRole(userAddress, nativeDomainId, ColonyRole.Funding);
  const administrationRole = await colonyClient.hasUserRole(userAddress, nativeDomainId, ColonyRole.Administration);

  const role_0 = recoveryRole || null;
  const role_1 = rootRole || null;
  const role_2 = arbitrationRole || null;
  const role_3 = architectureRole || null;
  const role_5 = fundingRole || null;
  const role_6 = administrationRole || null;

  let blockNumber = latestBlockNumber;
  if (!blockNumber) {
    blockNumber = await colonyClient.provider.getBlockNumber();
  }

  await mutate('createColonyRole', {
    input: {
      id: rolesDatabaseId,
      latestBlock: blockNumber,
      // Link the Domain Model
      colonyRoleDomainId: domainDatabaseId,
      /*
       * @NOTE Link the user Model
       *
       * Note that this handler will fire even for events where the target
       * is something or someone not in the database (a user without an account,
       * a random addresss -- contract, extension, token, etc)
       *
       * This means that on the other side, if you will want to fetch the "rich"
       * value for the "User" object, it will crash, as that model link will not
       * exist.
       *
       * Make sure to account for that when fetching the query (you can still fetch
       * the "colonyRoleUserId" value manually, and linking it yourself to the
       * appropriate entity)
       */
      colonyRoleUserId: userAddress,
      // Link the Colony Model
      colonyRolesId: colonyAddress,
      // Set the permissions
      role_0,
      role_1,
      role_2,
      role_3,
      role_5,
      role_6,
    },
  });

  verbose(
    `Create new Roles entry for user ${userAddress} in colony ${colonyAddress}, under domain ${nativeDomainId}`,
  );

  /*
   * Create the historic role entry
   */
  await createColonyHistoricRoleDatabaseEntry(
    colonyAddress,
    nativeDomainId,
    userAddress,
    blockNumber,
    {
      role_0,
      role_1,
      role_2,
      role_3,
      role_5,
      role_6,
    },
  );
};

/*
 * This is designed to run at the time a new colony has been created
 * and it expects to be passed the ColonyAdded event
 */
export const createColonyFounderInitialRoleEntry = async (event: ContractEvent): Promise<void> => {
  const { name, transactionHash, args } = event;
  const { colonyAddress } = args;

  const ColonyAddedEventName = ContractEventsSignatures.ColonyAdded.slice(0, ContractEventsSignatures.ColonyAdded.indexOf('('));
  const ColonyRoleSetEventName = ContractEventsSignatures.ColonyRoleSet.slice(0, ContractEventsSignatures.ColonyRoleSet.indexOf('('));

  if (name !== ColonyAddedEventName) {
    throw new Error('The event passed in is not the "ColonyAdded" event. We can\'t determine the colony\'s founder otherwise');
  }

  const colonyClient = await getCachedColonyClient(colonyAddress);
  const transactionReceipt = await colonyClient.provider.getTransactionReceipt(transactionHash);

  const events = await getAllRoleEventsFromTransaction(transactionHash, colonyAddress);
  const { args: { user: colonyFounderAddress } } = events.find(event => event?.name === ColonyRoleSetEventName) ?? { args: { user: '' } };

  await createInitialColonyRolesDatabaseEntry(
    colonyAddress,
    Id.RootDomain,
    colonyFounderAddress,
    transactionReceipt.blockNumber,
  );
};

/*
 * @NOTE Create historic colony role entry to be used in historic contexts (eg: recovery mode)
 *
 * While similar to `createInitialColonyRolesDatabaseEntry`, it is quite different in the arguments
 * it receives and mutation it calls
 */
export const createColonyHistoricRoleDatabaseEntry = async (
  colonyAddress: string,
  nativeDomainId: number,
  userAddress: string,
  blockNumber: number,
  roles: {
    role_0: boolean | null,
    role_1: boolean | null,
    role_2: boolean | null,
    role_3: boolean | null,
    role_5: boolean | null,
    role_6: boolean | null,
  },
): Promise<void> => {
  const id = getColonyHistoricRolesDatabaseId(colonyAddress, nativeDomainId, userAddress, blockNumber);
  const domainDatabaseId = getDomainDatabaseId(colonyAddress, nativeDomainId);

  await mutate('createColonyHistoricRole', {
    input: {
      id,
      // Look in schema.grapql (in the CDapp) about why this is needed
      type: 'SortedHistoricRole',
      blockNumber,
      // Link the Domain Model
      colonyHistoricRoleDomainId: domainDatabaseId,
      /*
       * @NOTE Link the user Model
       *
       * Note that this handler will fire even for events where the target
       * is something or someone not in the database (a user without an account,
       * a random addresss -- contract, extension, token, etc)
       *
       * This means that on the other side, if you will want to fetch the "rich"
       * value for the "User" object, it will crash, as that model link will not
       * exist.
       *
       * Make sure to account for that when fetching the query (you can still fetch
       * the "colonyRoleUserId" value manually, and linking it yourself to the
       * appropriate entity)
       */
      colonyHistoricRoleUserId: userAddress,
      // Link the Colony Model
      colonyHistoricRoleColonyId: colonyAddress,
      // Set the permissions
      ...roles,
    },
  });

  verbose(
    `Create new Historic Roles entry for user ${userAddress} in colony ${colonyAddress}, under domain ${nativeDomainId} at block ${blockNumber}`,
  );
};
