import { mutate, query } from '~amplifyClient';
import { ContractEvent } from '~types';
import { output } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { feeInverse } = event.args;
  const convertedFee = feeInverse.toString();

  const { items: networkInverseFees } = await query(
    'getCurrentNetworkInverseFee',
  );

  const hasExistingNetworkInverseFee = !!networkInverseFees?.length;

  if (hasExistingNetworkInverseFee) {
    await mutate(
        'updateCurrentNetworkInverseFee',
      {
        input: {
          id: networkInverseFees[0].id,
          convertedFee,
        },
      },
    );
  } else {
    await mutate(
      'createCurrentNetworkInverseFee',
      {
        input: {
          convertedFee,
        },
      },
    );    
  }

  output('New network inverse fee:', convertedFee);
};
