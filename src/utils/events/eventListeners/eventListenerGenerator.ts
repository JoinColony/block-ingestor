import { ClientType, Extension, getTokenClient } from '@colony/colony-js';
import { Log, Provider } from '@ethersproject/abstract-provider';
import { utils } from 'ethers';

import { query } from '~amplifyClient';
import { addEvent } from '~eventQueue';
import networkClient from '~networkClient';
import { ContractEventsSignatures, NetworkClients } from '~types';
import { getCachedColonyClient } from '~utils/colonyClient';
import { verbose } from '~utils/logger';
import ctx from '~context';

/**
 * Generator method for events listeners
 *
 * It basically does away with all the boilerplate of setting up topics, setting
 * the event listener, parsing the received event
 */
export const eventListenerGenerator = async (
  eventSignature: ContractEventsSignatures,
  contractAddress: string,
  clientType: ClientType = ClientType.NetworkClient,
  saveRemoverInContext: boolean = false,
): Promise<void> => {
  const { client, provider } = await getClientAndProvider(
    clientType,
    contractAddress,
  );

  const filter = getEventFilter(eventSignature, contractAddress, clientType);

  verbose(
    'Added listener for Event:',
    eventSignature,
    contractAddress ? `filtering Address: ${contractAddress}` : '',
  );

  const handleEvent = async (log: Log): Promise<void> => {
    await addEventToQueue(client, clientType, contractAddress, log, provider);
  };

  provider.on(filter, handleEvent);

  const listenerRemover = (): void => {
    verbose(
      'Removed listener for Event:',
      eventSignature,
      contractAddress ? `filtering Address: ${contractAddress}` : '',
    );
    provider.off(filter, handleEvent);
  };

  if (saveRemoverInContext) {
    const listenerRemoverKey = generateListenerRemoverKey(
      contractAddress,
      clientType,
      eventSignature,
    );
    ctx.listenerRemovers[listenerRemoverKey] = listenerRemover;
  }
};

/* Generate a unique key for the listenerRemover. */

export const generateListenerRemoverKey = (
  contractAddress: string,
  clientType: ClientType,
  eventSignature: ContractEventsSignatures,
): string => `${contractAddress}-${clientType}-${eventSignature}`;
/**
 * Handle the event listener generator-specific client and provider logic
 */
const getClientAndProvider = async (
  clientType: ClientType,
  contractAddress: string,
): Promise<{ client: NetworkClients; provider: Provider }> => {
  let client: NetworkClients = networkClient;
  let { provider } = client;

  switch (clientType) {
    case ClientType.ColonyClient: {
      client = await getCachedColonyClient(contractAddress);
      break;
    }
    case ClientType.VotingReputationClient: {
      const colonyClient = await getCachedColonyClient(contractAddress);
      client = await colonyClient.getExtensionClient(
        Extension.VotingReputation,
      );
      provider = client.provider;
      break;
    }
    default: {
      break;
    }
  }

  return { client: client as NetworkClients, provider };
};

/**
 * Get the event filter for the event listener generator.
 *
 */
const getEventFilter = (
  eventSignature: string,
  contractAddress: string,
  clientType: ClientType,
): { topics: Array<string | null>; address?: string } => {
  const filter: { topics: Array<string | null>; address?: string } = {
    topics: [utils.id(eventSignature)],
  };

  switch (clientType) {
    case ClientType.TokenClient: {
      filter.topics = [
        ...filter.topics,
        null,
        utils.hexZeroPad(contractAddress, 32),
      ];
      break;
    }

    case ClientType.VotingReputationClient: {
      break;
    }

    default: {
      filter.address = contractAddress;
      break;
    }
  }

  return filter;
};

/**
 * Add the contract event to the event queue to be processed by the event processor.
 */
const addEventToQueue = async (
  client: NetworkClients,
  clientType: ClientType,
  contractAddress: string,
  log: Log,
  provider: Provider,
): Promise<void> => {
  const {
    transactionHash,
    logIndex,
    blockNumber,
    address: eventContractAddress,
  } = log;
  try {
    const { hash: blockHash, timestamp } = await provider.getBlock(blockNumber);

    const event = {
      blockNumber,
      transactionHash,
      logIndex,
      contractAddress,
      blockHash,
      timestamp,
    };

    switch (clientType) {
      case ClientType.TokenClient: {
        const tokenClient = await getTokenClient(
          eventContractAddress,
          provider,
        );
        event.contractAddress = eventContractAddress;
        addEvent({
          ...tokenClient.interface.parseLog(log),
          ...event,
        });
        break;
      }

      case ClientType.VotingReputationClient: {
        /*
         * In the case of Voting Rep, only add the event to the queue if the colony address
         * associated with the event is the same as the colony address the listener is associated with.
         */
        const { colonyId } = await query(GetColonyExtensionDocument, {
          id: eventContractAddress,
        });
        if (colonyId === contractAddress) {
          addEvent({
            ...client.interface.parseLog(log),
            ...event,
          });
        }
        break;
      }

      default: {
        addEvent({
          ...client.interface.parseLog(log),
          ...event,
        });
        break;
      }
    }
  } catch (error) {
    verbose('Failed to process the event: ', error);
  }
};
