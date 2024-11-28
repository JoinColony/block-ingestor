import { BigNumber, BigNumberish } from 'ethers';
import { query } from '~amplifyClient';
import {
  GetCurrentNetworkInverseFeeDocument,
  GetCurrentNetworkInverseFeeQuery,
  GetCurrentNetworkInverseFeeQueryVariables,
} from '@joincolony/graphql';

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

// NOTE: The equation to calculate totalToPay is as following (in Wei)
// totalToPay = (receivedAmount + 1) * (feeInverse / (feeInverse -1))
// The network adds 1 wei extra fee after the percentage calculation
// For more info check out
// https://github.com/JoinColony/colonyNetwork/blob/806e4d5750dc3a6b9fa80f6e007773b28327c90f/contracts/colony/ColonyFunding.sol#L656
export const getAmountWithFee = (
  amount: BigNumberish,
  fee: BigNumberish,
): BigNumber => {
  const amountWithFee = BigNumber.from(amount)
    .add(1)
    .mul(fee)
    .div(BigNumber.from(fee).sub(1));

  return amountWithFee;
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

export const splitAmountAndFee = async (
  amountWithFee: BigNumberish,
): Promise<[string, string]> => {
  const networkInverseFee = (await getNetworkInverseFee()) ?? '0';
  const amountLessFee = getAmountLessFee(
    amountWithFee,
    networkInverseFee,
  ).toString();
  const feeAmount = BigNumber.from(amountWithFee).sub(amountLessFee).toString();

  return [amountLessFee, feeAmount];
};
