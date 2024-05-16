import { ExtensionEventListener } from '~eventListeners';
import { EventHandler } from '~types';
import {
  addStakedExpenditureParamsToDB,
  getStakedExpenditureClient,
} from '~utils';

export const handleStakeFractionSet: EventHandler = async (
  _,
  listener,
): Promise<void> => {
  const { colonyAddress } = listener as ExtensionEventListener;

  if (!colonyAddress) {
    return;
  }

  const stakedExpenditureClient = await getStakedExpenditureClient(
    colonyAddress,
  );

  if (!stakedExpenditureClient) {
    return;
  }

  await addStakedExpenditureParamsToDB(
    stakedExpenditureClient?.address,
    colonyAddress,
  );
};
