import { AnyStakedExpenditureClient } from '@colony/colony-js';
import { mutate } from '~amplifyClient';
import {
  ExtensionParams,
  UpdateColonyExtensionByAddressDocument,
  UpdateColonyExtensionByAddressMutation,
  UpdateColonyExtensionByAddressMutationVariables,
} from '~graphql';
import { getStakedExpenditureClient } from '~utils';

const getStakedExpenditureParams = async (
  stakedExpenditureClient: AnyStakedExpenditureClient,
): Promise<ExtensionParams> => {
  const stakeFraction = (
    await stakedExpenditureClient.getStakeFraction()
  ).toString();

  return {
    stakedExpenditure: {
      stakeFraction,
    },
  };
};

export const addStakedExpenditureParamsToDB = async (
  extensionAddress: string,
  colonyAddress: string,
): Promise<void> => {
  const stakedExpenditureClient = await getStakedExpenditureClient(
    colonyAddress,
  );

  if (!stakedExpenditureClient) {
    return;
  }

  const params = await getStakedExpenditureParams(stakedExpenditureClient);
  await mutate<
    UpdateColonyExtensionByAddressMutation,
    UpdateColonyExtensionByAddressMutationVariables
  >(UpdateColonyExtensionByAddressDocument, {
    input: {
      id: extensionAddress,
      params,
    },
  });
};
