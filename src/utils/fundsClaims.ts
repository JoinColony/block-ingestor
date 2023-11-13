import { mutate } from '~amplifyClient';
import {
  CreateColonyFundsClaimDocument,
  CreateColonyFundsClaimMutation,
  CreateColonyFundsClaimMutationVariables,
} from '~graphql';
import { getChainId } from '~provider';
import { ContractEvent } from '~types';

interface CreateFundsClaimsParams {
  event: ContractEvent;
  colonyAddress: string;
  tokenAddress: string;
  amount: string;
}

export const createFundsClaim = async ({
  colonyAddress,
  tokenAddress,
  amount,
  event: { transactionHash, logIndex, blockNumber },
}: CreateFundsClaimsParams): Promise<void> => {
  const chainId = getChainId();

  await mutate<
    CreateColonyFundsClaimMutation,
    CreateColonyFundsClaimMutationVariables
  >(CreateColonyFundsClaimDocument, {
    input: {
      id: getFundsClaimDatabaseId(chainId, transactionHash, logIndex),
      colonyFundsClaimsId: colonyAddress,
      colonyFundsClaimTokenId: tokenAddress,
      createdAtBlock: blockNumber,
      amount,
    },
  });
};

export const getFundsClaimDatabaseId = (
  chainId: number,
  transactionHash: string,
  logIndex: number,
): string => `${chainId}_${transactionHash}_${logIndex}`;
