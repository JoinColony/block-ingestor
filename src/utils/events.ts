import { BigNumber, utils } from 'ethers';
import { Log } from '@ethersproject/providers';

import networkClient from '~networkClient';
import { ContractEvent, ContractEventsSignatures } from '~types';
import { mutate, query } from '~amplifyClient';
import { getChainId } from '~provider';

import { verbose } from './logger';

/**
 * Convert a Set that contains a JSON string, back into JS form
 */
export const setToJS = (set: Set<string>): Array<Record<string, string>> =>
  Array.from(set).map((entry) => JSON.parse(entry));

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
    console.error(error);
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
    chainMetadata: Record<string, string | number>;
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
      (await query('getContractEvent', {
        id: contractEvent.id,
      })) || {};
    existingContractEvent = existingContractEventId;
  }
  if (!existingContractEvent) {
    await mutate('createContractEvent', { input: contractEvent });
    verbose(
      `Saving event ${contractEvent.signature} to the database for ${contractAddress}`,
    );
  }
};
