import { ColonyActionType, ContractEvent } from '~types';
import { writeActionFromEvent, getColonyTokenAddress, verbose } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { agent: initiatorAddress, who: recipientAddress, amount } = event.args;

  const tokenAddress = await getColonyTokenAddress(colonyAddress);

  if (amount && amount.toString() !== '0') {
    await writeActionFromEvent(event, colonyAddress, {
      type: ColonyActionType.MintTokens,
      initiatorAddress,
      recipientAddress,
      amount: amount.toString(),
      tokenAddress,
    });
  } else {
    verbose(
      `Detected Mint Tokens event but its amount was ${
        amount ? amount.toString() : amount
      }`,
    );
  }
};
