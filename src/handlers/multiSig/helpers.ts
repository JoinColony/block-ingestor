import { BigNumber } from 'ethers';
import { mutate, query } from '~amplifyClient';
import {
  GetUserMultiSigSignatureDocument,
  GetUserMultiSigSignatureQuery,
  GetUserMultiSigSignatureQueryVariables,
  MultiSigUserSignatureFragment,
  MultiSigVote,
  ColonyMultiSig,
  GetColonyMultiSigDocument,
  GetColonyMultiSigQuery,
  GetColonyMultiSigQueryVariables,
  UpdateColonyMultiSigDocument,
  UpdateColonyMultiSigInput,
  RemoveMultiSigVoteMutation,
  RemoveMultiSigVoteMutationVariables,
  RemoveMultiSigVoteDocument,
  CreateMultiSigVoteMutation,
  CreateMultiSigVoteMutationVariables,
  CreateMultiSigVoteDocument,
  ColonyActionType,
} from '~graphql';
import { getBlockChainTimestampISODate } from '~utils/dates';
import { output } from '~utils/logger';
import { NotificationCategory } from '~utils/notifications';

export const getMultiSigDatabaseId = (
  chainId: string,
  multiSigExtnAddress: string,
  nativeMultiSigId: BigNumber,
): string => `${chainId}-${multiSigExtnAddress}_${nativeMultiSigId}`;

interface GetUserMultiSigSignatureParams {
  multiSigId: string;
  userAddress: string;
  vote: MultiSigVote;
  role: number;
}
export const getUserMultiSigSignature = async ({
  multiSigId,
  userAddress,
  vote,
  role,
}: GetUserMultiSigSignatureParams): Promise<MultiSigUserSignatureFragment | null> => {
  const response = await query<
    GetUserMultiSigSignatureQuery,
    GetUserMultiSigSignatureQueryVariables
  >(GetUserMultiSigSignatureDocument, {
    vote,
    userAddress,
    multiSigId,
    role,
  });

  const responseItems =
    response?.data?.getMultiSigUserSignatureByMultiSigId?.items ?? [];

  if (responseItems.length > 0) {
    return responseItems[0];
  }

  return null;
};

export const getMultiSigFromDB = async (
  databaseMultiSigId: string,
): Promise<ColonyMultiSig | null | undefined> => {
  const { data } =
    (await query<GetColonyMultiSigQuery, GetColonyMultiSigQueryVariables>(
      GetColonyMultiSigDocument,
      {
        id: databaseMultiSigId,
      },
    )) ?? {};

  const multiSig = data?.getColonyMultiSig;

  if (!multiSig) {
    output(
      'Could not find the multiSig in the db. This is a bug and needs investigating.',
    );
  }

  return multiSig;
};

export const updateMultiSigInDB = async (
  multiSigData: UpdateColonyMultiSigInput,
): Promise<void> => {
  await mutate(UpdateColonyMultiSigDocument, {
    input: {
      ...multiSigData,
    },
  });
};

interface addMultiSigVoteParams {
  userAddress: string;
  colonyAddress: string;
  multiSigId: string;
  role: number;
  vote: MultiSigVote.Approve | MultiSigVote.Reject;
  timestamp: number;
}

export const addMultiSigVote = async ({
  multiSigId,
  role,
  userAddress,
  colonyAddress,
  vote,
  timestamp,
}: addMultiSigVoteParams): Promise<void> => {
  await mutate<CreateMultiSigVoteMutation, CreateMultiSigVoteMutationVariables>(
    CreateMultiSigVoteDocument,
    {
      input: {
        colonyAddress,
        multiSigId,
        userAddress,
        role,
        vote,
        createdAt: getBlockChainTimestampISODate(timestamp),
      },
    },
  );
};

export const removeMultiSigVote = async (id: string): Promise<void> => {
  await mutate<RemoveMultiSigVoteMutation, RemoveMultiSigVoteMutationVariables>(
    RemoveMultiSigVoteDocument,
    { id },
  );
};

export const getMultisigNotificationCategory = async (
  type: ColonyActionType | undefined,
): Promise<NotificationCategory | null> => {
  let notificationCategory: NotificationCategory | null;

  switch (type) {
    case ColonyActionType.AddVerifiedMembersMultisig: {
      notificationCategory = NotificationCategory.Admin;
      break;
    }
    case ColonyActionType.CancelStakedExpenditureMultisig: {
      notificationCategory = NotificationCategory.Payment;
      break;
    }
    case ColonyActionType.ColonyEditMultisig: {
      notificationCategory = NotificationCategory.Admin;
      break;
    }
    case ColonyActionType.CreateDecisionMultisig: {
      notificationCategory = NotificationCategory.Admin;
      break;
    }
    case ColonyActionType.CreateDomainMultisig: {
      notificationCategory = NotificationCategory.Admin;
      break;
    }
    case ColonyActionType.EditDomainMultisig: {
      notificationCategory = NotificationCategory.Admin;
      break;
    }
    case ColonyActionType.EmitDomainReputationPenaltyMultisig: {
      notificationCategory = NotificationCategory.Admin;
      break;
    }
    case ColonyActionType.EmitDomainReputationRewardMultisig: {
      notificationCategory = NotificationCategory.Admin;
      break;
    }
    case ColonyActionType.FundExpenditureMultisig: {
      notificationCategory = NotificationCategory.Payment;
      break;
    }
    case ColonyActionType.MakeArbitraryTransactionsMultisig: {
      notificationCategory = NotificationCategory.Admin;
      break;
    }
    case ColonyActionType.ManageTokensMultisig: {
      notificationCategory = NotificationCategory.Payment;
      break;
    }
    case ColonyActionType.MintTokensMultisig: {
      notificationCategory = NotificationCategory.Payment;
      break;
    }
    case ColonyActionType.MoveFundsMultisig: {
      notificationCategory = NotificationCategory.Payment;
      break;
    }
    case ColonyActionType.MultiplePaymentMultisig: {
      notificationCategory = NotificationCategory.Payment;
      break;
    }
    case ColonyActionType.PaymentMultisig: {
      notificationCategory = NotificationCategory.Payment;
      break;
    }
    case ColonyActionType.UnlockTokenMultisig: {
      notificationCategory = NotificationCategory.Payment;
      break;
    }
    case ColonyActionType.SetUserRolesMultisig: {
      notificationCategory = NotificationCategory.Admin;
      break;
    }
    case ColonyActionType.VersionUpgradeMultisig: {
      notificationCategory = NotificationCategory.Admin;
      break;
    }
    case ColonyActionType.SetExpenditureStateMultisig: {
      notificationCategory = NotificationCategory.Payment;
      break;
    }
    case ColonyActionType.RemoveVerifiedMembersMultisig: {
      notificationCategory = NotificationCategory.Admin;
      break;
    }
    default: {
      notificationCategory = null;
      break;
    }
  }

  return notificationCategory;
};
