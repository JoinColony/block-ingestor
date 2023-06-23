import { utils, constants } from 'ethers';
import {
  IColonyEvents__factory as ColonyEventsFactory,
  VotingReputationEvents__factory as VotingReputationEventsFactory,
  TokenEvents__factory as TokenEventsFactory,
} from '@colony/events';

import networkClient from '~networkClient';
import provider from '~provider';
import { EventListenerType } from '~eventListeners';

/**
 * Function returning ABI-derived interface for a given event listener type,
 * which is later used for parsing event logs
 */
export const getInterfaceByListenerType = (
  listenerType: EventListenerType,
): utils.Interface | null => {
  switch (listenerType) {
    case EventListenerType.Network: {
      return networkClient.interface;
    }
    case EventListenerType.Colony: {
      return ColonyEventsFactory.connect(constants.AddressZero, provider)
        .interface;
    }
    case EventListenerType.Extension: {
      return VotingReputationEventsFactory.connect(
        constants.AddressZero,
        provider,
      ).interface;
    }
    case EventListenerType.Token: {
      return TokenEventsFactory.connect(constants.AddressZero, provider)
        .interface;
    }
    default: {
      return null;
    }
  }
};
