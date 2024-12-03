import { TokenClientType } from '@colony/colony-js';

import { ContractEvent } from '~types';
import {
  getCachedTokenClient,
  fetchColoniesByNativeToken,
  updateSingleColonyNativeTokenStatuses,
} from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress, blockNumber } = event;

  const client = await getCachedTokenClient(contractAddress);

  if (!client) {
    return;
  }

  const colonies = await fetchColoniesByNativeToken(contractAddress);

  for (const colony of colonies) {
    const { id: colonyAddress } = colony;
    let unlockable = false;
    let mintable = false;

    // only set the unlock / mint status for colony network tokens
    if (client.tokenClientType === TokenClientType.Colony) {
      try {
        await client.provider.call(
          {
            from: colonyAddress,
            to: client.address,
            data: client.interface.encodeFunctionData('unlock()'),
          },
          blockNumber,
        );
        unlockable = true;
      } catch (error) {
        // silent
      }

      try {
        await client.provider.call(
          {
            from: colonyAddress,
            to: client.address,
            data: client.interface.encodeFunctionData('mint(uint256)', [1]),
          },
          blockNumber,
        );
        mintable = true;
      } catch (error) {
        // silent
      }
    } else {
      // any other type of token
      // note that we can't be sure if the token even has the mint function,
      // or if it does, what signature does it have
      try {
        // @ts-expect-error
        await client.estimateGas.mint(1, { from: colonyAddress });
        mintable = true;
      } catch (error) {
        // silent
      }
    }

    await updateSingleColonyNativeTokenStatuses(colony, {
      unlockable,
      mintable,
    });
  }
};
