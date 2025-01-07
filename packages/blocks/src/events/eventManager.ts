import { verbose } from '@joincolony/utils';
import { EventListener, EventListenerType } from './types';
import { RpcProvider } from '@joincolony/clients';
import { utils, constants } from 'ethers';
import {
  IColonyEvents__factory as ColonyEventsFactory,
  VotingReputationEvents__factory as VotingReputationEventsFactory,
  StakedExpenditureEvents__factory as StakedExpenditureEventsFactory,
  TokenEvents__factory as TokenEventsFactory,
  StagedExpenditureEvents__factory as StagedExpenditureEventsFactory,
  OneTxPaymentEvents__factory as OneTxPaymentEventsFactory,
  StreamingPaymentsEvents__factory as StreamingPaymentsEventsFactory,
  MultisigPermissionsEvents__factory as MultisigPermissionsEventsFactory,
  IColonyNetworkEvents__factory as ColonyNetworkEventsFactory,
} from '@colony/events';
import { Extension, getExtensionHash } from '@colony/colony-js';

// @TODO @chmanie is gonna make this better, for now let's just hardcode the proxy colony events
export const ProxyColonyEvents = new utils.Interface([
  'event ProxyColonyRequested(address colony,uint256 destinationChainId, bytes32 salt)',
  'event ProxyColonyDeployed(address proxyColony)',
  // @TODO decouple these into MultiChainBridgeEvents
  'event WormholeMessageReceived(uint16 emitterChainId, bytes32 emitterAddress, uint64 sequence)',
  'event LogMessagePublished(address indexed sender,uint64 sequence,uint32 nonce,bytes payload,uint8 consistencyLevel)',
  'function createProxyColony(uint256 _destinationChainId, bytes32 _salt)',
]);

export class EventManager {
  private listeners: EventListener[] = [];
  private readonly rpcProvider: RpcProvider;

  constructor(rpcProvider: RpcProvider) {
    this.rpcProvider = rpcProvider;
  }

  public getEventListeners(): EventListener[] {
    return this.listeners;
  }

  public setEventListeners(newListeners: EventListener[]): void {
    this.listeners = newListeners;
  }

  public addEventListener(listener: EventListener): void {
    verbose(
      `Added listener for event ${listener.eventSignature}`,
      listener.address ? `filtering address ${listener.address}` : '',
    );
    this.listeners.push(listener);
  }

  public getMatchingListeners(
    logTopics: string[],
    logAddress: string,
  ): EventListener[] {
    return this.listeners.filter((listener) => {
      if (listener.address && logAddress !== listener.address) {
        return false;
      }

      if (listener.topics.length > logTopics.length) {
        return false;
      }

      return listener.topics.every((topic, index) => {
        return (
          topic === null ||
          topic.toLowerCase() === logTopics[index].toLowerCase()
        );
      });
    });
  }

  public getListenersStats(): string {
    return JSON.stringify(this.listeners);
  }

  /**
   * Function returning ABI-derived interface for a given event listener type,
   * which is later used for parsing event logs
   */
  public getInterfaceByListener(
    listener: EventListener,
  ): utils.Interface | null {
    const provider = this.rpcProvider.getProviderInstance();
    const { type: listenerType } = listener;

    switch (listenerType) {
      case EventListenerType.Network: {
        return ColonyNetworkEventsFactory.connect(
          constants.AddressZero,
          provider,
        ).interface;
      }
      case EventListenerType.ProxyColonies: {
        return ProxyColonyEvents;
      }
      case EventListenerType.Colony: {
        return ColonyEventsFactory.connect(constants.AddressZero, provider)
          .interface;
      }
      case EventListenerType.Extension: {
        return this.getInterfaceByExtensionHash(listener.extensionHash);
      }
      case EventListenerType.Token: {
        return TokenEventsFactory.connect(constants.AddressZero, provider)
          .interface;
      }
      default: {
        return null;
      }
    }
  }

  private getInterfaceByExtensionHash(
    extensionHash: string,
  ): utils.Interface | null {
    const provider = this.rpcProvider.getProviderInstance();

    switch (extensionHash) {
      case getExtensionHash(Extension.OneTxPayment): {
        return OneTxPaymentEventsFactory.connect(
          constants.AddressZero,
          provider,
        ).interface;
      }
      case getExtensionHash(Extension.VotingReputation): {
        return VotingReputationEventsFactory.connect(
          constants.AddressZero,
          provider,
        ).interface;
      }
      case getExtensionHash(Extension.MultisigPermissions): {
        return MultisigPermissionsEventsFactory.connect(
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
  }
}
