import { ClientType } from '@colony/colony-js';
import { utils, constants } from 'ethers';
import {
  IColonyEvents__factory as ColonyEventsFactory,
  VotingReputationEvents__factory as VotingReputationEventsFactory,
  TokenEvents__factory as TokenEventsFactory,
} from '@colony/events';

import networkClient from '~networkClient';
import provider from '~provider';

/**
 * Function returning ABI-derived interface for a given client type,
 * which is later used for parsing event logs
 */
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
    case ClientType.TokenClient: {
      return TokenEventsFactory.connect(constants.AddressZero, provider)
        .interface;
    }
    default: {
      return null;
    }
  }
};
