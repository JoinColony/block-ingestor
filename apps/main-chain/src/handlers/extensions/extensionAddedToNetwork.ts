import { ContractEvent } from '@joincolony/blocks';
import { writeExtensionVersionFromEvent } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  await writeExtensionVersionFromEvent(event);
};
