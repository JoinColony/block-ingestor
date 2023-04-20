import { mutate } from '~amplifyClient';
import { NETWORK_INVERSE_FEE_DATABASE_ID } from '~constants';
import { ContractEvent } from '~types';
import { output } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { feeInverse } = event.args;
  const convertedFee = feeInverse.toString();

  await mutate(
      'updateCurrentNetworkInverseFee',
    {
      input: {
        id: NETWORK_INVERSE_FEE_DATABASE_ID,
        inverseFee: convertedFee,
      },
    },
  );

  output('New network inverse fee:', convertedFee);
};
