import { ColonyRole, Id } from '@colony/colony-js';

import { mutate } from '~amplifyClient';
import { ContractEvent, ContractEventsSignatures } from '~types';

import {
  verbose,
  getCachedColonyClient,
  getDomainDatabaseId,
} from '~utils';

export const getColonyRolesDatabaseId = (
  colonyAddress: string,
  nativeDomainId: number,
  userAddress: string,
): string => `${colonyAddress}_${nativeDomainId}_${userAddress}_roles`;

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
      role_0: recoveryRole || null,
      role_1: rootRole || null,
      role_2: arbitrationRole || null,
      role_3: architectureRole || null,
      role_5: fundingRole || null,
      role_6: administrationRole || null,
    },
  });

  verbose(
    `Create new roles entry for user ${userAddress} in colony ${colonyAddress}, under domain ${nativeDomainId}`,
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

  const { args: { user: colonyFounderAddress } } = transactionReceipt.logs
    .map(log => {
      try {
        return colonyClient.interface.parseLog(log);
      } catch (error) {
        return undefined;
      }
    })
    .filter(event => !!event)
    .find(event => event?.name === ColonyRoleSetEventName) ?? { args: { user: '' } };

  await createInitialColonyRolesDatabaseEntry(
    colonyAddress,
    Id.RootDomain,
    colonyFounderAddress,
    transactionReceipt.blockNumber,
  );
};
