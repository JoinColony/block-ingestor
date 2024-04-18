import { BigNumber, utils } from 'ethers';
import { Log } from '@ethersproject/providers';

import networkClient from '~networkClient';
import { ContractEvent, ContractEventsSignatures } from '~types';
import { mutate, query } from '~amplifyClient';
import { getChainId } from '~provider';
import {
  CreateContractEventDocument,
  CreateContractEventMutation,
  CreateContractEventMutationVariables,
  GetContractEventDocument,
  GetContractEventQuery,
  GetContractEventQueryVariables,
  ChainMetadata,
} from '~graphql';
import { blocksMap } from '~blockListener';

import { verbose } from './logger';

export const mapLogToContractEvent = async (
  log: Log,
  iface: utils.Interface,
  // Additional properties to attach to the contract event
  additionalProperties?: Record<string, unknown>,
): Promise<ContractEvent | null> => {
  const { provider } = networkClient;
  const {
    transactionHash,
    logIndex,
    blockNumber,
    address: eventContractAddress,
  } = log;

  try {
    // Attempt to first get a block from the map as we might have already fetched its info
    let block = blocksMap.get(blockNumber);
    if (!block) {
      block = await provider.getBlock(blockNumber);
      blocksMap.set(blockNumber, block);
    }

    const { hash: blockHash, timestamp } = block;
    const parsedLog = iface.parseLog(log);

    return {
      ...parsedLog,
      blockNumber,
      transactionHash,
      logIndex,
      contractAddress: eventContractAddress,
      blockHash,
      timestamp,
      ...additionalProperties,
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
    chainMetadata: ChainMetadata;
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
      chainId: Number(chainId), // @TODO why did this change?
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
