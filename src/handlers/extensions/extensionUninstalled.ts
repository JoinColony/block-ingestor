import { ContractEvent } from '~types';
import { deleteExtensionFromEvent, removeMotionListeners } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const {
    args: { colony: colonyAddress },
  } = event;
  await deleteExtensionFromEvent(event);
  removeMotionListeners(colonyAddress);
};
