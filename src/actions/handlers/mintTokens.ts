import { ActionHandler } from '~actions/types';

export const handleMintTokensAction: ActionHandler = async (events) => {
  console.log('Mint Tokens action ', events);
};
