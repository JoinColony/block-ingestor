import { utils, constants } from 'ethers';
import {
  IColonyEvents__factory as ColonyEventsFactory,
  VotingReputationEvents__factory as VotingReputationEventsFactory,
  StakedExpenditureEvents__factory as StakedExpenditureEventsFactory,
  TokenEvents__factory as TokenEventsFactory,
  StagedExpenditureEvents__factory as StagedExpenditureEventsFactory,
  StreamingPaymentsEvents__factory as StreamingPaymentsEventsFactory,
} from '@colony/colony-js/events';
import { Extension, getExtensionHash } from '@colony/colony-js';

import networkClient from '~networkClient';
import provider from '~provider';
import { EventListener, EventListenerType } from '~eventListeners';

/**
 * Function returning ABI-derived interface for a given event listener type,
 * which is later used for parsing event logs
 */
export const getInterfaceByListener = (
  listener: EventListener,
): utils.Interface | null => {
  const { type: listenerType } = listener;

  switch (listenerType) {
    case EventListenerType.Network: {
      return networkClient.interface;
    }
    case EventListenerType.Colony: {
      return ColonyEventsFactory.connect(constants.AddressZero, provider)
        .interface;
    }
    case EventListenerType.Extension: {
      return getInterfaceByExtensionHash(listener.extensionHash);
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

const getInterfaceByExtensionHash = (
  extensionHash: string,
): utils.Interface | null => {
  switch (extensionHash) {
    case getExtensionHash(Extension.VotingReputation): {
      return VotingReputationEventsFactory.connect(
        constants.AddressZero,
        provider,
      ).interface;
    }
    case getExtensionHash(Extension.StakedExpenditure): {
      return StakedExpenditureEventsFactory.connect(
        constants.AddressZero,
        provider,
      ).interface;
    }
    case getExtensionHash(Extension.StagedExpenditure): {
      return StagedExpenditureEventsFactory.connect(
        constants.AddressZero,
        provider,
      ).interface;
    }
    case getExtensionHash(Extension.StreamingPayments): {
      return StreamingPaymentsEventsFactory.connect(
        constants.AddressZero,
        provider,
      ).interface;
    }
    default: {
      return null;
    }
  }
};
