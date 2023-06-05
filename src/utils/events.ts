import { BigNumber, utils } from 'ethers';
import { Log } from '@ethersproject/providers';
import {
  AnyColonyClient,
  ClientType,
  ColonyNetworkClient,
  getTokenClient,
  TokenClient,
} from '@colony/colony-js';

import networkClient from '~networkClient';
import { ContractEvent, ContractEventsSignatures, Filter } from '~types';
import { addEvent } from '~eventQueue';
import { mutate, query } from '~amplifyClient';
import { getChainId } from '~provider';
import {
  CreateContractEventDocument,
  CreateContractEventMutation,
  CreateContractEventMutationVariables,
  GetContractEventDocument,
  GetContractEventQuery,
  GetContractEventQueryVariables,
  ChainMetadataInput,
} from '~graphql';

import { getExtensionContract } from './extensions';
import { verbose } from './logger';
import { getCachedColonyClient } from './colonyClient';

/*
 * Convert a Set that contains a JSON string, back into JS form
 */
export const setToJS = (set: Set<string>): Array<Record<string, string>> =>
  Array.from(set).map((entry) => JSON.parse(entry));

/*
 * Generator method for events listeners
 *
 * It basically does away with all the boilerplate of setting up topics, setting
 * the event listener, parsing the received event
 */
export const eventListenerGenerator = async (
  eventSignature: ContractEventsSignatures,
  contractAddress: string,
  clientType: ClientType = ClientType.NetworkClient,
): Promise<void> => {
  const { provider } = networkClient;
  let client: ColonyNetworkClient | TokenClient | AnyColonyClient =
    networkClient;
  if (clientType === ClientType.ColonyClient && contractAddress) {
    client = await getCachedColonyClient(contractAddress);
  }

  const filter: Filter = {
    topics: [utils.id(eventSignature)],
  };

  if (clientType === ClientType.TokenClient) {
    filter.topics = [
      ...(filter.topics ?? []),
      null,
      utils.hexZeroPad(contractAddress, 32),
    ];
  } else {
    filter.address = contractAddress;
  }

  verbose(
    'Added listener for Event:',
    eventSignature,
    contractAddress ? `filtering Address: ${contractAddress}` : '',
  );

  provider.on(filter, async (log: Log) => {
    const { address: eventContractAddress } = log;
    if (clientType === ClientType.TokenClient) {
      client = await getTokenClient(eventContractAddress, provider);
    }
    try {
      const event = await mapLogToContractEvent(log, client.interface);
      if (event) {
        addEvent(event);
      }
    } catch (error) {
      verbose('Failed to process the event: ', error);
    }
  });
};

/*
 * Network Client specific event listener,
 * which uses `eventListenerGenerator` under the hood
 */
export const addNetworkEventListener = async (
  eventSignature: ContractEventsSignatures,
  contractAddress: string = networkClient.address,
): Promise<void> =>
  await eventListenerGenerator(
    eventSignature,
    contractAddress,
    ClientType.NetworkClient,
  );

/*
 * Colony Client specific event listener,
 * which uses `eventListenerGenerator` under the hood
 */
export const addColonyEventListener = async (
  eventSignature: ContractEventsSignatures,
  contractAddress: string,
): Promise<void> =>
  await eventListenerGenerator(
    eventSignature,
    contractAddress,
    ClientType.ColonyClient,
  );

/*
 * Token Client specific event listener,
 * which uses `eventListenerGenerator` under the hood
 */
export const addTokenEventListener = async (
  eventSignature: ContractEventsSignatures,
  contractAddress: string,
): Promise<void> =>
  await eventListenerGenerator(
    eventSignature,
    contractAddress,
    ClientType.TokenClient,
  );

/**
 * Extension specific event listener
 * It creates a new interface with ABI data describing
 * possible event signature
 */
export const addExtensionEventListener = async (
  eventSignature: ContractEventsSignatures,
  extensionAddress: string,
): Promise<void> => {
  const { provider } = networkClient;
  const extensionContract = getExtensionContract(extensionAddress);
  const filter = {
    topics: [utils.id(eventSignature)],
    address: extensionAddress,
  };

  verbose(
    'Added listener for Event:',
    eventSignature,
    extensionAddress ? `filtering Address: ${extensionAddress}` : '',
  );

  provider.on(filter, async (log: Log) => {
    const event = await mapLogToContractEvent(log, extensionContract.interface);

    if (event) {
      addEvent(event);
    }
  });
};

export const mapLogToContractEvent = async (
  log: Log,
  iface: utils.Interface,
): Promise<ContractEvent | null> => {
  const { provider } = networkClient;
  const {
    transactionHash,
    logIndex,
    blockNumber,
    address: eventContractAddress,
  } = log;

  try {
    const { hash: blockHash, timestamp } = await provider.getBlock(blockNumber);
    const parsedLog = iface.parseLog(log);

    return {
      ...parsedLog,
      blockNumber,
      transactionHash,
      logIndex,
      contractAddress: eventContractAddress,
      blockHash,
      timestamp,
    };
  } catch (error) {
    /*
     * Silent Error
     *
     * This does not need to be loud since, at times, you'll map through a whole
     * lot of events which might not know how to interface with since they were
     * generated by other contracts
     */
    return null;
  }
};

export const saveEvent = async (event: ContractEvent): Promise<void> => {
  if (!event.signature) {
    throw new Error(
      'Event does not have a signature. Possibly bad event data. Refusing the save to database!',
    );
  }
  const chainId = getChainId();

  const {
    name,
    signature,
    logIndex,
    transactionHash,
    blockNumber,
    args = {},
    contractAddress,
  } = event;

  /*
   * Parse Args
   */
  const keys = Object.keys(args);
  const parsedArgs: Record<string, string> = {};
  keys.slice(keys.length / 2).map((key) => {
    if (BigNumber.isBigNumber(args[key as keyof typeof args])) {
      parsedArgs[key] = (
        args[key as keyof typeof args] as BigNumber
      ).toString();
    }
    parsedArgs[key] = String(args[key as keyof typeof args]);
    return undefined;
  });

  const contractEvent: {
    id: string;
    agent: string;
    chainMetadata: ChainMetadataInput;
    name: string;
    signature: string;
    target: string;
    encodedArguments?: string;
    contractEventTokenId?: string;
    contractEventUserId?: string;
    contractEventDomainId?: string;
    contractEventColonyId?: string;
  } = {
    id: `${chainId}_${transactionHash}_${logIndex}`,
    agent: parsedArgs?.agent || contractAddress,
    chainMetadata: {
      chainId,
      transactionHash,
      logIndex,
      blockNumber,
    },
    name,
    signature,
    target: parsedArgs?.dst || contractAddress,
    encodedArguments: JSON.stringify(parsedArgs),
  };

  switch (signature) {
    case ContractEventsSignatures.ColonyFundsClaimed: {
      /*
       * Link to colony and token
       */
      contractEvent.contractEventTokenId = parsedArgs.token;
      contractEvent.contractEventColonyId = contractAddress;
      break;
    }

    default: {
      break;
    }
  }

  /*
   * @NOTE That this check is only required for local development where
   * the chain does not mine a new block automatically, so you'll most likely
   *  run parsing / events listener on the same block over and over
   * So as to not mess up your data / database, only create the event
   * if it does not exist
   *
   * @TODO an idea of how to reduce queries is to wrap this in a try catch block
   * and just send out the mutation
   * If it succeeds, great, the event is created, if it fails, assume the event
   * already existed in the database
   */
  let existingContractEvent;
  if (process.env.NODE_ENV !== 'production') {
    const { id: existingContractEventId } =
      (
        await query<GetContractEventQuery, GetContractEventQueryVariables>(
          GetContractEventDocument,
          {
            id: contractEvent.id,
          },
        )
      )?.data?.getContractEvent ?? {};
    existingContractEvent = existingContractEventId;
  }
  if (!existingContractEvent) {
    await mutate<
      CreateContractEventMutation,
      CreateContractEventMutationVariables
    >(CreateContractEventDocument, { input: contractEvent });
    verbose(
      `Saving event ${contractEvent.signature} to the database for ${contractAddress}`,
    );
  }
};
