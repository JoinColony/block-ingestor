import { Extension } from '@colony/colony-js';

export const COLONY_CURRENT_VERSION_KEY = 'colony';

export const SUPPORTED_EXTENSION_IDS = [
  Extension.OneTxPayment,
  Extension.VotingReputation,
];
export const INITIALISABLE_EXTENSION_IDS = [Extension.VotingReputation];
