import {
  MetadataDeltaOperation,
  getApprovedTokenChanges,
  getColonyFromDB,
} from '~utils';
import { createMultiSigInDB } from '../../helpers';
import { ColonyActionType } from '@joincolony/graphql';
import { ContractEvent } from '~types';

export const manageTokensMultisigHandler = async ({
  colonyAddress,
  event,
  operation,
}: {
  colonyAddress: string;
  event: ContractEvent;
  operation: MetadataDeltaOperation;
}): Promise<void> => {
  const tokenAddresses = operation.payload;

  const colony = await getColonyFromDB(colonyAddress);

  if (!colony) {
    return;
  }

  const { modifiedTokenAddresses, unaffectedTokenAddresses } =
    getApprovedTokenChanges({
      colony,
      tokenAddresses,
    });

  await createMultiSigInDB(colonyAddress, event, {
    type: ColonyActionType.ManageTokensMultisig,
    approvedTokenChanges: {
      added: modifiedTokenAddresses.added,
      removed: modifiedTokenAddresses.removed,
      unaffected: unaffectedTokenAddresses,
    },
  });
};
