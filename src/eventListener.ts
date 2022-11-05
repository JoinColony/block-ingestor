import { addProviderListener } from './utils';
import { ContractEventsSignatures } from './types';

const eventListener = (): void => {
  addProviderListener(ContractEventsSignatures.Transfer);
};

export default eventListener;
