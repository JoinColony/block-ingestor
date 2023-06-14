import { ClientType } from '@colony/colony-js';
import { utils, constants } from 'ethers';
import {
  IColonyEvents__factory as ColonyEventsFactory,
  VotingReputationEvents__factory as VotingReputationEventsFactory,
} from '@colony/events';

import networkClient from '~networkClient';
import provider from '~provider';

export const getInterfaceByClientType = (
  clientType: ClientType,
): utils.Interface | null => {
  switch (clientType) {
    case ClientType.NetworkClient: {
      return networkClient.interface;
    }
    case ClientType.ColonyClient: {
      return ColonyEventsFactory.connect(constants.AddressZero, provider)
        .interface;
    }
    case ClientType.VotingReputationClient: {
      return VotingReputationEventsFactory.connect(
        constants.AddressZero,
        provider,
      ).interface;
    }
    default: {
      return null;
    }
  }
};
