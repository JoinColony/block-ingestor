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
import {
  ArbitraryTransaction,
  getDomainDatabaseId,
  writeActionFromEvent,
} from '~utils';
import { mutate, query } from '~amplifyClient';
import { sendPermissionsActionNotifications } from '../../utils/notifications';
import { NotificationCategory } from '../../types/notifications';

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
