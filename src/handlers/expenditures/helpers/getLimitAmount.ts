import { BigNumber } from 'ethers';
import { query } from '~amplifyClient';
import {
  GetTokenByAddressDocument,
  GetTokenByAddressQuery,
  GetTokenByAddressQueryVariables,
} from '~graphql';
import { output } from '~utils';

export const getLimitAmount = async ({
  startTime,
  endTime,
  amount,
  interval,
  tokenAddress,
}: {
  startTime: string;
  endTime: string;
  amount: string;
  interval: string;
  tokenAddress: string;
}): Promise<BigNumber | undefined> => {
  const { data } =
    (await query<GetTokenByAddressQuery, GetTokenByAddressQueryVariables>(
      GetTokenByAddressDocument,
      {
        address: tokenAddress,
      },
    )) ?? {};

  if (!data?.getTokenByAddress || !data.getTokenByAddress.items[0]) {
    output(
      `Could not find token with address ${tokenAddress}. This is a bug and should be investigated.`,
    );
    return;
  }

  const tokenDecimals = data.getTokenByAddress.items[0].decimals;

  const getOriginalAmount = (amount: string): BigNumber => {
    return BigNumber.from(amount).div(BigNumber.from(10).pow(tokenDecimals));
  };

  const originalAmount = getOriginalAmount(amount);

  const limit = BigNumber.from(endTime)
    .sub(startTime)
    .mul(originalAmount)
    .div(interval);
  return limit;
};
