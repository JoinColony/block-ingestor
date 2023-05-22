import { ClientType, getTokenClient } from '@colony/colony-js';
import { Log } from '@ethersproject/abstract-provider';
import { utils } from 'ethers';

import { query } from '~amplifyClient';
import { addEvent } from '~eventQueue';
import { ContractEventsSignatures, Filter, NetworkClients } from '~types';
import { getClient, verbose } from '~utils';

import { saveRemover } from './listenerRemover';

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
  isRemovable: boolean = false,
): Promise<void> => {
  const client = await getClient(clientType, contractAddress);
  if (!client) {
    return;
  }

  const filter = getEventFilter(eventSignature, contractAddress, clientType);

  verbose(
    'Added listener for Event:',
    eventSignature,
    contractAddress ? `filtering Address: ${contractAddress}` : '',
  );

  const handleEvent = async (log: Log): Promise<void> => {
    await addEventToQueue(client, clientType, contractAddress, log);
  };

  const { provider } = client;
  provider.on(filter, handleEvent);

  if (isRemovable) {
    const listenerRemover = (): void => {
      verbose(
        'Removed listener for Event:',
        eventSignature,
        contractAddress ? `filtering Address: ${contractAddress}` : '',
      );
      provider.off(filter, handleEvent);
    };

    saveRemover(contractAddress, clientType, eventSignature, listenerRemover);
  }
};

/**
 * Get the event filter for the event listener generator.
 *
 */
export const getEventFilter = (
  eventSignature: string,
  contractAddress: string,
  clientType: ClientType = ClientType.ColonyClient,
): Filter => {
  const filter: Filter = {
    topics: [utils.id(eventSignature)],
  };

  switch (clientType) {
    case ClientType.TokenClient: {
      filter.topics = [
        ...(filter.topics ?? []),
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
): Promise<void> => {
  const {
    transactionHash,
    logIndex,
    blockNumber,
    address: eventContractAddress,
  } = log;
  try {
    const { provider } = client;
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
        const { colonyId } = await query('getColonyExtension', {
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
