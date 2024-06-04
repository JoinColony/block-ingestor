import { ColonyActionType } from '~graphql';
import { ContractEvent } from '~types';
import {
  ManageTokensOperation /* , writeActionFromEvent */,
  getColonyFromDB,
  getExistingTokenAddresses,
  getModifiedTokenAddresses,
  updateColonyTokens,
  writeActionFromEvent,
} from '~utils';

export const handleManageTokens = async (
  event: ContractEvent,
  operation: ManageTokensOperation,
): Promise<void> => {
  const { contractAddress: colonyAddress } = event;
  const { agent: initiatorAddress } = event.args;

  const tokenAddresses = operation.payload;

  const colony = await getColonyFromDB(colonyAddress);

  if (!colony) {
    return;
  }

  const existingTokenAddresses = getExistingTokenAddresses(colony);
  const modifiedTokenAddresses = getModifiedTokenAddresses(
    colony,
    tokenAddresses,
  );

  const unaffectedTokenAddresses = existingTokenAddresses.filter(
    (address) => !modifiedTokenAddresses.removed.includes(address),
  );

  await updateColonyTokens(
    colony,
    existingTokenAddresses,
    modifiedTokenAddresses,
  );

  await writeActionFromEvent(event, colonyAddress, {
    type: ColonyActionType.ManageTokens,
    initiatorAddress,
    approvedTokenChanges: {
      added: modifiedTokenAddresses.added,
      removed: modifiedTokenAddresses.removed,
      unaffected: unaffectedTokenAddresses,
    },
  });
};
