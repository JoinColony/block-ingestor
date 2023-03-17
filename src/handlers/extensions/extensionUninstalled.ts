import { EventProcessorContext } from '~eventProcessor';
import { ContractEvent } from '~types';
import { deleteExtensionFromEvent } from '~utils';
import { EXTENSION_INITIALISED_MOTION_LISTENERS } from './extensionInitialised';

export default async (
  event: ContractEvent,
  context: EventProcessorContext,
): Promise<void> => {
  const {
    args: { colony: colonyAddress },
  } = event;
  await deleteExtensionFromEvent(event);
  const removeListeners =
    context.removeListeners[colonyAddress]?.[
      EXTENSION_INITIALISED_MOTION_LISTENERS
    ];
  removeListeners?.forEach((removeListener) => {
    removeListener();
  });
};
