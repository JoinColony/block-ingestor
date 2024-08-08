import { mutate, query } from '~amplifyClient';
import {
  GetColonyExtensionByAddressDocument,
  GetColonyExtensionByAddressQuery,
  GetColonyExtensionByAddressQueryVariables,
  GetDomainsByExtensionAddressDocument,
  GetDomainsByExtensionAddressQuery,
  GetDomainsByExtensionAddressQueryVariables,
  UpdateColonyExtensionByAddressDocument,
  UpdateColonyExtensionByAddressMutation,
  UpdateColonyExtensionByAddressMutationVariables,
} from '~graphql';
import { ContractEvent, EventHandler } from '~types';
import { getCachedColonyClient, toNumber } from '~utils';

export const handleMultiSigDomainSkillThresholdSet: EventHandler = async (
  event: ContractEvent,
) => {
  const { contractAddress: multiSigAddress } = event;
  const { domainSkillId, threshold } = event.args;

  const colonyExtensionsResponse = await query<
    GetColonyExtensionByAddressQuery,
    GetColonyExtensionByAddressQueryVariables
  >(GetColonyExtensionByAddressDocument, {
    extensionAddress: multiSigAddress,
  });

  const { multiSig } =
    colonyExtensionsResponse?.data?.getColonyExtension?.params ?? {};

  if (multiSig) {
    const domainsResponse = await query<
      GetDomainsByExtensionAddressQuery,
      GetDomainsByExtensionAddressQueryVariables
    >(GetDomainsByExtensionAddressDocument, {
      extensionAddress: multiSigAddress,
    });
    const colonyDomains =
      domainsResponse?.data?.listColonyExtensions?.items[0]?.colony.domains
        ?.items ?? [];
    const colonyAddress =
      domainsResponse?.data?.listColonyExtensions?.items[0]?.colony.id ?? '';
    const colonyClient = await getCachedColonyClient(colonyAddress);

    if (!colonyClient) {
      return;
    }

    const updatedDomainThresholds = [...(multiSig.domainThresholds ?? [])];

    const matchingDomain = colonyDomains.find((domain) =>
      domainSkillId.eq(domain?.nativeSkillId),
    );

    if (matchingDomain) {
      const domainId = matchingDomain.nativeId.toString();
      const domainThresholdIndex =
        multiSig.domainThresholds?.findIndex(
          (domainThreshold) => (domainThreshold?.domainId ?? '') === domainId,
        ) ?? -1;

      if (domainThresholdIndex > -1) {
        updatedDomainThresholds[domainThresholdIndex] = {
          domainId,
          domainThreshold: toNumber(threshold),
        };
      } else {
        updatedDomainThresholds.push({
          domainId,
          domainThreshold: toNumber(threshold),
        });
      }
    }

    await mutate<
      UpdateColonyExtensionByAddressMutation,
      UpdateColonyExtensionByAddressMutationVariables
    >(UpdateColonyExtensionByAddressDocument, {
      input: {
        id: multiSigAddress,
        params: {
          multiSig: {
            ...multiSig,
            domainThresholds: updatedDomainThresholds,
          },
        },
      },
    });
  }
};
