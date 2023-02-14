import { ColonyActionType, ContractEvent } from '../../../types';
import { getColonyTokenAddress } from '../../tokens';
import { writeActionFromEvent } from '../writeAction';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { agent: initiatorAddress, who: recipientAddress, amount } = event.args;

  const tokenAddress = await getColonyTokenAddress(colonyAddress);

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.MintTokens,
    initiatorAddress,
    recipientAddress,
    amount: amount.toString(),
    tokenAddress,
  });
};
