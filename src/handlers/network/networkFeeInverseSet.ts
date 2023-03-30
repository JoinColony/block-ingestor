import { mutate } from '~amplifyClient';
import { ContractEvent } from '~types';
import { toNumber, verbose } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { feeInverse } = event.args;
  const convertedFee = toNumber(feeInverse);

  verbose('New network inverse fee:', convertedFee);

  await mutate('setCurrentNetworkInverseFee', {
    input: {
      inverseFee: convertedFee,
    },
  });
};
