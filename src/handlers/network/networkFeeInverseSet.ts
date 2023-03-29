import { mutate } from '~amplifyClient';
import { NETWORK_INVERSE_FEE_KEY } from '~constants';
import { ContractEvent } from '~types';
import { toNumber, verbose } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { feeInverse } = event.args;
  const convertedFee = toNumber(feeInverse);

  verbose('New network inverse fee:', convertedFee);

  await mutate('setCurrentInverseFee', {
    input: {
      key: NETWORK_INVERSE_FEE_KEY,
      inverseFee: convertedFee,
    },
  });
};
