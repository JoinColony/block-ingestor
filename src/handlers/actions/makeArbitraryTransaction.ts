import { Id } from '@colony/colony-js';

import {
  ColonyActionType,
  GetColonyArbitraryTransactionActionDocument,
  GetColonyArbitraryTransactionActionQuery,
  GetColonyArbitraryTransactionActionQueryVariables,
  UpdateColonyActionDocument,
  UpdateColonyActionMutation,
  UpdateColonyActionMutationVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import provider from '~provider';
import {
  ArbitraryTransaction,
  getDomainDatabaseId,
  writeActionFromEvent,
} from '~utils';
import { mutate, query } from '~amplifyClient';

export default async (event: ContractEvent): Promise<void> => {
  const { target: contractAddress, data: encodedFunction } = event.args;

  const { contractAddress: colonyAddress, transactionHash } = event;
  const receipt = await provider.getTransactionReceipt(event.transactionHash);

  const currentArbitraryTransaction: ArbitraryTransaction = {
    contractAddress,
    encodedFunction,
  };
  const { data } =
    (await query<
      GetColonyArbitraryTransactionActionQuery,
      GetColonyArbitraryTransactionActionQueryVariables
    >(GetColonyArbitraryTransactionActionDocument, { transactionHash })) ?? {};

  // @NOTE: If it's already been processed, just push an arbitrary transaction to this action
  if (data?.getColonyAction?.id) {
    const prevArbitraryTransactions =
      data.getColonyAction.arbitraryTransactions ?? [];
    await mutate<
      UpdateColonyActionMutation,
      UpdateColonyActionMutationVariables
    >(UpdateColonyActionDocument, {
      input: {
        id: transactionHash,
        arbitraryTransactions: [
          ...prevArbitraryTransactions,
          currentArbitraryTransaction,
        ],
      },
    });
    return;
  }

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.MakeArbitraryTransaction,
    initiatorAddress: receipt.from,
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
    arbitraryTransactions: [currentArbitraryTransaction],
  });
};
