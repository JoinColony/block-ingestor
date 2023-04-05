import dotenv from 'dotenv';

import networkClient from './networkClient';
import {
  output,
  verbose,
  addNetworkEventListener,
} from './utils';
import { ContractEventsSignatures } from './types';
import { mutate } from './amplifyClient';

dotenv.config();

export default async (): Promise<void> => {
  verbose('Fetching current network inverse fee');

  const networkInverseFee = await networkClient.getFeeInverse();
  const convertedFee = networkInverseFee.toString();

  await mutate('createCurrentNetworkInverseFee', {
    input: {
      inverseFee: convertedFee,
    },
  });

  output('Current network inverse fee is: ', convertedFee);
};
