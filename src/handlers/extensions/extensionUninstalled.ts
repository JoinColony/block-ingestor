import { ContractEvent } from '~/types';
import { deleteExtensionFromEvent } from '~/utils';

export default async (event: ContractEvent): Promise<void> => {
  await deleteExtensionFromEvent(event);
};
