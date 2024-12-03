import { Id } from '@colony/colony-js';

import {
  ColonyActionType,
  GetColonyActionDocument,
  GetColonyActionQuery,
  GetColonyActionQueryVariables,
} from '@joincolony/graphql';
import { ContractEvent } from '@joincolony/blocks';
import rpcProvider from '~provider';
import { getDomainDatabaseId, writeActionFromEvent } from '~utils';
import amplifyClient from '~amplifyClient';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress, transactionHash } = event;
  const receipt = await rpcProvider
    .getProviderInstance()
    .getTransactionReceipt(event.transactionHash);

  const { data } =
    (await amplifyClient.query<
      GetColonyActionQuery,
      GetColonyActionQueryVariables
    >(GetColonyActionDocument, { transactionHash })) ?? {};

  // @NOTE: Filter out the event if it's already been processed (It can happen with multi-transactions)
  if (data?.getColonyAction?.id) {
    return;
  }

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.MakeArbitraryTransaction,
    initiatorAddress: receipt.from,
    recipientAddress: receipt.to,
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
  });
};
