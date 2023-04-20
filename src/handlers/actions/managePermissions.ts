import { mutate, query } from '~amplifyClient';
import { ColonyActionType, ContractEvent } from '~types';

// import {
//   toNumber,
//   writeActionFromEvent,
//   getDomainDatabaseId,
//   getCachedColonyClient,
// } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { name, signature, args, contractAddress } = event;
  const { agent, user, domainId, role, setTo } = args;

  const id = `${contractAddress}_${domainId.toString()}_${user}_roles`;
  const roleValue = {
    /* set it back to null rather than false, for consistency */
    [`role_${role}`]: setTo || null,
  };

  /*
   * @TODO
   * - capture initial colony permissions (user creator permissions)
   * - capture permissions for users that don't have an account created
   * - create action list entry
   * - handle individual recovery role being set
   */

  /*
   * If the agent is the actual network contract, DON'T expose the action
   * This will only happed the first time colony is created
   */
  if (agent === process.env.CHAIN_NETWORK_CONTRACT) {
    console.log('Role was set by the network contract');
  }

  const { id: existingColonyRoleId } =
    (await query('getColonyRole', {
      id,
    })) || {};

  if (existingColonyRoleId) {
    console.log('update entry for', contractAddress, user, domainId.toString(), 'role', role, setTo);
    // update the entry
    await mutate('updateColonyRole', {
      input: {
        id,
        ...roleValue,
      },
    });
  } else {
    console.log('create new entry for', contractAddress, user, domainId.toString(), 'role', role, setTo);
    // create a new entry
    await mutate('createColonyRole', {
      input: {
        id,
        // Link the Domain Model
        colonyRoleDomainId: `${contractAddress}_${domainId.toString()}`,
        // Link the User Model
        colonyRoleUserId: user,
        // Link the Colony Model
        colonyRolesId: contractAddress,
        ...roleValue,
      },
    });

    // verbose(
    //   `Saving event ${signature} to the database for ${contractAddress}`,
    // );
  }

  // await writeActionFromEvent(event, colonyAddress, {
  //   type: ColonyActionType.CreateDomain,
  //   fromDomainId: databaseDomainId,
  //   initiatorAddress,
  // });
};
