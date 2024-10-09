import { EventHandler } from '~types';
import { updateExtension } from '~utils/extensions/updateExtension';

export const handleStakeFractionSet: EventHandler = async (
  event,
): Promise<void> => {
  const { contractAddress } = event;
  const { stakeFraction } = event.args;

  await updateExtension(contractAddress, {
    params: {
      stakedExpenditure: {
        stakeFraction: stakeFraction.toString(),
      },
    },
  });
};
