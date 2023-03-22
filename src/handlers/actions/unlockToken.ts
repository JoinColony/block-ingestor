import { Id } from '@colony/colony-js';
import networkClient from '~networkClient';
import { ColonyActionType, ContractEvent } from '~types';
import { writeActionFromEvent, getDomainDatabaseId } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { agent: initiatorAddress } = event.args;

  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  const tokenAddress = await colonyClient.getToken();

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.UnlockToken,
    initiatorAddress,
    tokenAddress,
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
  });
};
