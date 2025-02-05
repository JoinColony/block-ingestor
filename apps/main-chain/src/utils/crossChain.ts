import { ContractEvent } from '@joincolony/blocks';
import {
  CreateMultiChainInfoInput,
  UpdateMultiChainInfoInput,
} from '@joincolony/graphql';
import {
  getMultiChainInfoId,
  output,
  upsertMultiChainInfo,
} from '@joincolony/utils';
import amplifyClient from '~amplifyClient';

export const getAndSyncMultiChainInfo = async (
  wormholeEvent: ContractEvent,
  txHash: string,
  chainId: number,
): Promise<string | undefined> => {
  const { sender, sequence } = wormholeEvent.args;
  const emitterAddress = sender.toString();
  const emitterSequence = sequence.toString();

  if (!emitterAddress || !sequence) {
    output('Missing arguments on the LogMessagePublished events');
    return undefined;
  }

  // we could technically use this one, but we should use the one of the created one, just so we have all the core logic in the upsertMultiChainInfo helper
  const existingMultiChainInfoId = getMultiChainInfoId(txHash, chainId);

  const createMultiChainInfoInput: CreateMultiChainInfoInput = {
    id: existingMultiChainInfoId,
    completedOnMainChain: true,
    completedOnProxyChain: false,
    wormholeInfo: {
      sequence: emitterSequence,
      emitterAddress,
    },
  };

  const updateMultiChainInfoInput: UpdateMultiChainInfoInput = {
    id: existingMultiChainInfoId,
    completedOnMainChain: true,
    wormholeInfo: {
      sequence: emitterSequence,
      emitterAddress,
    },
  };

  const multiChainInfoId = await upsertMultiChainInfo(
    amplifyClient,
    existingMultiChainInfoId,
    createMultiChainInfoInput,
    updateMultiChainInfoInput,
  );

  return multiChainInfoId;
};
