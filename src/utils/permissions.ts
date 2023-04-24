/* eslint-disable @typescript-eslint/naming-convention */

import { ColonyRole, Id } from '@colony/colony-js';

import { mutate, query } from '~amplifyClient';
import { ContractEvent, ContractEventsSignatures, ColonyActionType } from '~types';

import {
  verbose,
  getCachedColonyClient,
  getDomainDatabaseId,
  mapLogToContractEvent,
  writeActionFromEvent,
} from '~utils';

const BASE_ROLES_MAP = {
  [`role_${ColonyRole.Recovery}`]: null,
  [`role_${ColonyRole.Root}`]: null,
  [`role_${ColonyRole.Arbitration}`]: null,
  [`role_${ColonyRole.Architecture}`]: null,
  [`role_${ColonyRole.Funding}`]: null,
  [`role_${ColonyRole.Administration}`]: null,
};

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

export const getRolesMapFromEvents = (roleEvents: ContractEvent[], setToNull: boolean = true): Record<string, boolean | null> => {
  let roleMap = {};

  roleEvents.map(({
    signature,
    args: { role, setTo },
  }) => {
    /*
     * @NOTE This logic is begining to get kinda complicated so I'm going to attempt to explain it
     *
     * It's role is to format the object key/value pairs for roles (eg: `{ role_1: true }`).
     *
     * Since we have a separate event for `RecoveryRoleSet` which has a different format than the rest, check for it, and convert the
     * role to `0` if we find it.
     *
     * Second part (after the || operator check) deals with how we display the "off" side of the role. To keep database consistency, for operational
     * roles (ie: the ones we use to check against), we check the `false` value (which signifies the permission was taken away) to `null` as that is
     * the default state of the GraphQL entry. For Actions however, we need to set it to `false` as to distiguish itself, and for us to know what
     * to display in the Action's text. For this we use `setToNull`, which, when set (on by default), changes the "off" state to null, and when it's
     * not being set, changes the "off" state to false
     */
    const roleValue = { [`role_${signature === ContractEventsSignatures.RecoveryRoleSet ? 0 : role}`]: setTo || (setToNull ? null : setTo) };
    roleMap = {
      ...roleMap,
      ...roleValue,
    };
    return undefined;
  });

  return roleMap;
};

export const createInitialColonyRolesDatabaseEntry = async (
  colonyAddress: string,
  nativeDomainId: number,
  targetAddress: string,
  transactionHash: string,
): Promise<void> => {
  const rolesDatabaseId = getColonyRolesDatabaseId(colonyAddress, nativeDomainId, targetAddress);
  const domainDatabaseId = getDomainDatabaseId(colonyAddress, nativeDomainId);

  const colonyClient = await getCachedColonyClient(colonyAddress);

  const recoveryRole = await colonyClient.hasUserRole(targetAddress, nativeDomainId, ColonyRole.Recovery);
  const rootRole = await colonyClient.hasUserRole(targetAddress, nativeDomainId, ColonyRole.Root);
  const arbitrationRole = await colonyClient.hasUserRole(targetAddress, nativeDomainId, ColonyRole.Arbitration);
  const architectureRole = await colonyClient.hasUserRole(targetAddress, nativeDomainId, ColonyRole.Architecture);
  const fundingRole = await colonyClient.hasUserRole(targetAddress, nativeDomainId, ColonyRole.Funding);
  const administrationRole = await colonyClient.hasUserRole(targetAddress, nativeDomainId, ColonyRole.Administration);

  const role_0 = recoveryRole || null;
  const role_1 = rootRole || null;
  const role_2 = arbitrationRole || null;
  const role_3 = architectureRole || null;
  const role_5 = fundingRole || null;
  const role_6 = administrationRole || null;

  const colonyRoleSetEventName = ContractEventsSignatures.ColonyRoleSet.slice(0, ContractEventsSignatures.ColonyRoleSet.indexOf('('));
  const events = await getAllRoleEventsFromTransaction(transactionHash, colonyAddress);
  const firstRoleSetEvent = events.find(({ signature }) => signature === ContractEventsSignatures.ColonyRoleSet);
  const recoveryRoleSetEvent = events.find(({ signature }) => signature === ContractEventsSignatures.RecoveryRoleSet);
  const blockNumber = firstRoleSetEvent?.blockNumber ?? 0;

  await mutate('createColonyRole', {
    input: {
      id: rolesDatabaseId,
      latestBlock: blockNumber,
      // Link the Domain Model
      colonyRoleDomainId: domainDatabaseId,
      // Link the Colony Model
      colonyRolesId: colonyAddress,
      /*
       * @NOTE Link the target
       *
       * Note that this handler will fire even for events where the target
       * is something or someone not in the database.
       *
       * We try to account for this, by linking address to either a user, colony, or
       * extension via the target address, but it can happen regardless as the
       * address can be totally random
       *
       * Make sure to be aware of that when fetching the query (you can still fetch
       * the "targetAddress" value manually, and linking it yourself to the
       * appropriate entity)
       */
      targetAddress,

      // Set the permissions
      ...BASE_ROLES_MAP,
      role_0,
      role_1,
      role_2,
      role_3,
      role_5,
      role_6,
    },
  });

  verbose(
    `Create new Roles entry for ${targetAddress} in colony ${colonyAddress}, under domain ${nativeDomainId}`,
  );

  /*
   * Create the historic role entry
   */
  await createColonyHistoricRoleDatabaseEntry(
    colonyAddress,
    nativeDomainId,
    targetAddress,
    blockNumber,
    {
      ...BASE_ROLES_MAP,
      role_0,
      role_1,
      role_2,
      role_3,
      role_5,
      role_6,
    },
  );

  if (firstRoleSetEvent?.signature === ContractEventsSignatures.ColonyRoleSet) {
    /*
    * Create the action
    */
    await writeActionFromEvent(firstRoleSetEvent, colonyAddress, {
      type: ColonyActionType.SetUserRoles,
      fromDomainId: domainDatabaseId,
      initiatorAddress: firstRoleSetEvent?.args.agent,
      recipientAddress: targetAddress,
      roles: {
        ...BASE_ROLES_MAP,
        role_0,
        role_1,
        role_2,
        role_3,
        role_5,
        role_6,
      },
      individualEvents: JSON.stringify(
        [
          ...events
            .filter(({ signature }) => signature !== ContractEventsSignatures.RecoveryRoleSet)
            .map(({
              name,
              args: { role, setTo },
              transactionHash,
              logIndex,
            }) => ({
              id: `${transactionHash}_${logIndex}`,
              type: name,
              role,
              setTo,
            })),
          /*
           * THis is disabled b/c eslint's style cleanup breaks the layout somehow...
           */
          // eslint-disable-next-line multiline-ternary
          ...(recoveryRoleSetEvent ? [{
            id: `${recoveryRoleSetEvent.transactionHash}_${recoveryRoleSetEvent.logIndex}`,
            type: colonyRoleSetEventName,
            role: 0,
            setTo: recoveryRoleSetEvent.args.setTo,
          }] : []),
        ],
      ),
    });
  }
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

  const events = await getAllRoleEventsFromTransaction(transactionHash, colonyAddress);
  const { args: { user: colonyFounderAddress } } = events.find(event => event?.name === ColonyRoleSetEventName) ?? { args: { user: '' } };

  await createInitialColonyRolesDatabaseEntry(
    colonyAddress,
    Id.RootDomain,
    colonyFounderAddress,
    transactionHash,
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
  targetAddress: string,
  blockNumber: number,
  roles: Record<string, boolean | null> = BASE_ROLES_MAP,
): Promise<void> => {
  const id = getColonyHistoricRolesDatabaseId(colonyAddress, nativeDomainId, targetAddress, blockNumber);
  const domainDatabaseId = getDomainDatabaseId(colonyAddress, nativeDomainId);

  const {
    id: existingColonyRoleId,
  } = (await query('getColonyHistoricRole', { id })) || {};

  if (!existingColonyRoleId) {
    await mutate('createColonyHistoricRole', {
      input: {
        id,
        // Look in schema.grapql (in the CDapp) about why this is needed
        type: 'SortedHistoricRole',
        blockNumber,
        // Link the Domain Model
        colonyHistoricRoleDomainId: domainDatabaseId,
        // Link the Colony Model
        colonyHistoricRoleColonyId: colonyAddress,
        /*
         * @NOTE Link the target
         *
         * Note that this handler will fire even for events where the target
         * is something or someone not in the database.
         *
         * We try to account for this, by linking address to either a user, colony, or
         * extension via the target address, but it can happen regardless as the
         * address can be totally random
         *
         * Make sure to be aware of that when fetching the query (you can still fetch
         * the "targetAddress" value manually, and linking it yourself to the
         * appropriate entity)
         */
        targetAddress,

        // Set the permissions
        ...roles,
      },
    });

    verbose(
      `Create new Historic Roles entry for ${targetAddress} in colony ${colonyAddress}, under domain ${nativeDomainId} at block ${blockNumber}`,
    );
  }
};
