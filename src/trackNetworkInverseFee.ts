import dotenv from 'dotenv';

import networkClient from './networkClient';
import { output, verbose } from './utils';
import { mutate } from './amplifyClient';
import { NETWORK_INVERSE_FEE_DATABASE_ID } from '~constants';

dotenv.config();

export default async (): Promise<void> => {
  verbose('Fetching current network inverse fee');

  const networkInverseFee = await networkClient.getFeeInverse();
  const convertedFee = networkInverseFee.toString();

  await mutate('createCurrentNetworkInverseFee', {
    input: {
      id: NETWORK_INVERSE_FEE_DATABASE_ID,
      inverseFee: convertedFee,
    },
  });

  output('Current network inverse fee is: ', convertedFee);
};
