import { Contract } from 'ethers';

import provider from '../../provider';

const ABI = [
  {
    inputs: [],
    name: 'getColony',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export const getColonyByExtensionAddress = async (
  extensionAddress: string,
): Promise<string | null> => {
  try {
    const extensionContract = new Contract(extensionAddress, ABI, provider);
    const [colonyAddress] = await extensionContract.functions.getColony();
    return colonyAddress;
  } catch {
    return null;
  }
};
