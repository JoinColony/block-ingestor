import {
  ColonyActionType,
  CreateVerifiedMemberDocument,
  CreateVerifiedMemberMutation,
  CreateVerifiedMemberMutationVariables,
  GetVerifiedMemberDocument,
  GetVerifiedMemberQuery,
  GetVerifiedMemberQueryVariables,
} from '~graphql';
import { ContractEvent } from '~types';
import { verbose, writeActionFromEvent } from '~utils';
import {
  isAddVerifiedMembersOperation,
  isMetadataDeltaOperation,
  parseOperation,
} from './utils';
import { mutate, query } from '~amplifyClient';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { agent: initiatorAddress } = event.args;
  const operationString = event.args[1];

  if (!operationString) {
    verbose('Unable to get operation for ColonyMetadataDelta event');
  }

  const operation = parseOperation(operationString);

  if (!isMetadataDeltaOperation(operation)) {
    verbose(
      'Operation does not conform to MetadataDeltaOperation type: ',
      operation,
    );
    throw new Error('Unknown operation format');
  }

  if (isAddVerifiedMembersOperation(operation)) {
    await Promise.all(
      operation.members.map(async (userAddress) => {
        const item = await query<
          GetVerifiedMemberQuery,
          GetVerifiedMemberQueryVariables
        >(GetVerifiedMemberDocument, { colonyAddress, userAddress });

        const verifiedMemberData = item?.data?.getVerifiedMember;

        if (verifiedMemberData !== undefined && verifiedMemberData !== null) {
          throw new Error(
            `User ${userAddress} already a verified member of the colony ${colonyAddress}`,
          );
        }

        await mutate<
          CreateVerifiedMemberMutation,
          CreateVerifiedMemberMutationVariables
        >(CreateVerifiedMemberDocument, {
          input: { colonyAddress, userAddress },
        });
      }),
    );

    await writeActionFromEvent(event, colonyAddress, {
      type: ColonyActionType.AddVerifiedMembers,
      initiatorAddress,
      members: operation.members,
    });

    return;
  }
};
