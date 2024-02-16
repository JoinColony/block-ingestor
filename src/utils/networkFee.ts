import { BigNumber, BigNumberish } from 'ethers';
import { query } from '~amplifyClient';
import {
  GetCurrentNetworkInverseFeeDocument,
  GetCurrentNetworkInverseFeeQuery,
  GetCurrentNetworkInverseFeeQueryVariables,
} from '~graphql';

export const getAmountLessFee = (
  amount: BigNumberish,
  fee: BigNumberish,
): BigNumber => {
  const feeNumber = BigNumber.from(fee);

  if (!feeNumber.gt(0)) {
    return BigNumber.from(amount);
  }

  const feePercentage = BigNumber.from(100).div(fee);
  return BigNumber.from(amount)
    .mul(BigNumber.from(100).sub(feePercentage))
    .div(100);
};

export const getNetworkInverseFee = async (): Promise<string | null> => {
  const { data: networkFeeData } =
    (await query<
      GetCurrentNetworkInverseFeeQuery,
      GetCurrentNetworkInverseFeeQueryVariables
    >(GetCurrentNetworkInverseFeeDocument)) ?? {};
  const networkInverseFee =
    networkFeeData?.listCurrentNetworkInverseFees?.items?.[0]?.inverseFee;

  if (!networkInverseFee) {
    return null;
  }

  return networkInverseFee;
};
