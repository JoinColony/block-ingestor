import { Id } from '@colony/colony-js';

import {
  ColonyActionType,
  GetColonyArbitraryTransactionActionDocument,
  GetColonyArbitraryTransactionActionQuery,
  GetColonyArbitraryTransactionActionQueryVariables,
  UpdateColonyActionDocument,
  UpdateColonyActionMutation,
  UpdateColonyActionMutationVariables,
} from '@joincolony/graphql';
import { ContractEvent } from '@joincolony/blocks';
import {
  ArbitraryTransaction,
  getDomainDatabaseId,
  writeActionFromEvent,
} from '~utils';
import { sendPermissionsActionNotifications } from '../../utils/notifications';
import { NotificationCategory } from '../../types/notifications';
import amplifyClient from '~amplifyClient';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress, transactionHash } = event;
  const {
    target: contractAddress,
    data: encodedFunction,
    agent: initiatorAddress,
  } = event.args;

  const currentArbitraryTransaction: ArbitraryTransaction = {
    contractAddress,
    encodedFunction,
  };
  const { data } =
    (await amplifyClient.query<
      GetColonyArbitraryTransactionActionQuery,
      GetColonyArbitraryTransactionActionQueryVariables
    >(GetColonyArbitraryTransactionActionDocument, { transactionHash })) ?? {};

  // @NOTE: If it's already been processed, just push an arbitrary transaction to this action
  if (data?.getColonyAction?.id) {
    const prevArbitraryTransactions =
      data.getColonyAction.arbitraryTransactions ?? [];
    await amplifyClient.mutate<
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
    initiatorAddress,
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
    arbitraryTransactions: [currentArbitraryTransaction],
  });

  sendPermissionsActionNotifications({
    creator: initiatorAddress,
    colonyAddress,
    transactionHash,
    notificationCategory: NotificationCategory.Admin,
  });
};
