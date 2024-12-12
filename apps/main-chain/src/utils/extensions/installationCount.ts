import { Extension, getExtensionHash } from '@colony/colony-js';
import amplifyClient from '~amplifyClient';
import {
  CreateExtensionInstallationsCountDocument,
  CreateExtensionInstallationsCountMutation,
  CreateExtensionInstallationsCountMutationVariables,
  GetExtensionInstallationsCountDocument,
  GetExtensionInstallationsCountQuery,
  GetExtensionInstallationsCountQueryVariables,
  UpdateExtensionInstallationsCountDocument,
  UpdateExtensionInstallationsCountMutation,
  UpdateExtensionInstallationsCountMutationVariables,
} from '@joincolony/graphql';
import rpcProvider from '~provider';

const extensionHashDBKeyMap = {
  [getExtensionHash(Extension.VotingReputation)]: 'reputationWeighted',
  [getExtensionHash(Extension.StakedExpenditure)]: 'stakedExpenditure',
  [getExtensionHash(Extension.StagedExpenditure)]: 'stagedExpenditure',
  [getExtensionHash(Extension.OneTxPayment)]: 'oneTxPayment',
  [getExtensionHash(Extension.StreamingPayments)]: 'streamingPayments',
  [getExtensionHash(Extension.MultisigPermissions)]: 'multiSigPermissions',
};

const getExtensionCount = async (extensionHash: string): Promise<number> => {
  const provider = rpcProvider.getProviderInstance();

  const { data } =
    (await amplifyClient.query<
      GetExtensionInstallationsCountQuery,
      GetExtensionInstallationsCountQueryVariables
    >(GetExtensionInstallationsCountDocument, {
      id: provider.network.chainId.toString(),
    })) ?? {};

  if (!data?.getExtensionInstallationsCount) {
    await amplifyClient.mutate<
      CreateExtensionInstallationsCountMutation,
      CreateExtensionInstallationsCountMutationVariables
    >(CreateExtensionInstallationsCountDocument, {
      input: {
        id: provider.network.chainId.toString(),
        oneTxPayment: 0,
        stakedExpenditure: 0,
        stagedExpenditure: 0,
        streamingPayments: 0,
        reputationWeighted: 0,
        multiSigPermissions: 0,
      },
    });
  }

  const {
    oneTxPayment,
    stakedExpenditure,
    stagedExpenditure,
    streamingPayments,
    reputationWeighted,
    multiSigPermissions,
  } = data?.getExtensionInstallationsCount ?? {};

  const extensionHashCountMap = {
    [getExtensionHash(Extension.VotingReputation)]: reputationWeighted,
    [getExtensionHash(Extension.StakedExpenditure)]: stakedExpenditure,
    [getExtensionHash(Extension.StagedExpenditure)]: stagedExpenditure,
    [getExtensionHash(Extension.OneTxPayment)]: oneTxPayment,
    [getExtensionHash(Extension.StreamingPayments)]: streamingPayments,
    [getExtensionHash(Extension.MultisigPermissions)]: multiSigPermissions,
  };

  return extensionHashCountMap[extensionHash] ?? 0;
};

export const updateExtensionCount = async (
  extensionHash: string,
): Promise<void> => {
  const count = await getExtensionCount(extensionHash);

  const key = extensionHashDBKeyMap[extensionHash];

  await amplifyClient.mutate<
    UpdateExtensionInstallationsCountMutation,
    UpdateExtensionInstallationsCountMutationVariables
  >(UpdateExtensionInstallationsCountDocument, {
    input: {
      id: rpcProvider.getProviderInstance().network.chainId.toString(),
      [key]: count + 1,
    },
  });
};
