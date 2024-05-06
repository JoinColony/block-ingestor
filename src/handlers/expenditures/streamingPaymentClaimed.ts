import { EventHandler } from '~types';

export const handleStreamingPaymentClaimed: EventHandler = async (event) => {
  console.log('Streaming payment claimed: ', event);
};
