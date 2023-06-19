import { mutate } from '~amplifyClient';
import { NETWORK_INVERSE_FEE_DATABASE_ID } from '~constants';
import {
  CreateCurrentNetworkInverseFeeDocument,
  CreateCurrentNetworkInverseFeeMutation,
  CreateCurrentNetworkInverseFeeMutationVariables,
} from '~graphql';
import networkClient from '~networkClient';

import { verbose } from './logger';

/**
 * Function only relevant for dev environment since the network fee will have already been
 * stored in the DB in other environments
 */
export const writeCurrentNetworkFee = async (): Promise<void> => {
  const networkInverseFee = await networkClient.getFeeInverse();
  const convertedFee = networkInverseFee.toString();

  await mutate<
    CreateCurrentNetworkInverseFeeMutation,
    CreateCurrentNetworkInverseFeeMutationVariables
  >(CreateCurrentNetworkInverseFeeDocument, {
    input: {
      id: NETWORK_INVERSE_FEE_DATABASE_ID,
      inverseFee: convertedFee,
    },
  });

  verbose('Current network inverse fee is: ', convertedFee);
};
