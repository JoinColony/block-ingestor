import { ActionHandler } from './types';

export const handleMintTokensAction: ActionHandler = async (events) => {
  console.log('Mint Tokens action ', events);
};
