import {
  MetadataDeltaOperation,
  getApprovedTokenChanges,
  getColonyFromDB,
} from '~utils';
import { createMotionInDB } from '../../helpers';
import { ColonyActionType } from '~graphql';
import { ContractEvent } from '~types';
import { BigNumber } from 'ethers';

export const manageTokensMotionHandler = async ({
  colonyAddress,
  event,
  gasEstimate,
  operation,
}: {
  colonyAddress: string;
  event: ContractEvent;
  gasEstimate: BigNumber;
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

  await createMotionInDB(colonyAddress, event, {
    type: ColonyActionType.ManageTokensMotion,
    approvedTokenChanges: {
      added: modifiedTokenAddresses.added,
      removed: modifiedTokenAddresses.removed,
      unaffected: unaffectedTokenAddresses,
    },
    gasEstimate: gasEstimate.toString(),
  });
};
