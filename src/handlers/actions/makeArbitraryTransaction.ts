import { ColonyActionType } from '~graphql';
import { ContractEvent } from '~types';
import provider from '~provider';
import { writeActionFromEvent } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { target: recipientAddress } = event.args;
  const receipt = await provider.getTransactionReceipt(event.transactionHash);

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.MakeArbitraryTransaction,
    initiatorAddress: receipt.from,
    recipientAddress,
  });
};
