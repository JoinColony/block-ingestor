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
  argsByTypeToString,
  decodeArbitraryFunction,
  getDomainDatabaseId,
  writeActionFromEvent,
} from '~utils';
import { mutate, query } from '~amplifyClient';

export default async (event: ContractEvent): Promise<void> => {
  const contractAddress = event.args[0];
  const encodedFunction = event.args[1];
  const decodedFunction = await decodeArbitraryFunction(encodedFunction);
  const functionInputs = decodedFunction?.functionFragment.inputs;
  const functionArgs = decodedFunction?.args;

  const mappedArgs = functionInputs?.map((item, index) => {
    return {
      name: item.name,
      type: item.type,
      value: argsByTypeToString(functionArgs?.[index], item.type),
    };
  });

  const { contractAddress: colonyAddress, transactionHash } = event;
  const receipt = await provider.getTransactionReceipt(event.transactionHash);

  const currentArbitraryTransaction = {
    contractAddress,
    method: decodedFunction?.name,
    methodSignature: decodedFunction?.signature,
    args: mappedArgs,
  };
  const { data } =
    (await query<
      GetColonyArbitraryTransactionActionQuery,
      GetColonyArbitraryTransactionActionQueryVariables
    >(GetColonyArbitraryTransactionActionDocument, { transactionHash })) ?? {};

  // @NOTE: Filter out the event if it's already been processed (It can happen with multi-transactions)
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
    recipientAddress: receipt.to,
    fromDomainId: getDomainDatabaseId(colonyAddress, Id.RootDomain),
    arbitraryTransactions: [currentArbitraryTransaction],
  });
};
