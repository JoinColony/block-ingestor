import { ClientType } from '@colony/colony-js';
import { utils } from 'ethers';

import { abi as colonyAbi } from '~abis/ColonyEvents.json';
import { abi as votingRepAbi } from '~abis/VotingReputationEvents.json';
import networkClient from '~networkClient';

export const getInterfaceByClientType = (
  clientType: ClientType,
): utils.Interface | null => {
  switch (clientType) {
    case ClientType.NetworkClient: {
      return networkClient.interface;
    }
    case ClientType.ColonyClient: {
      return new utils.Interface(colonyAbi);
    }
    case ClientType.VotingReputationClient: {
      return new utils.Interface(votingRepAbi);
    }
    default: {
      return null;
    }
  }
};
