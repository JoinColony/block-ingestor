import { Extension } from '@colony/colony-js';

export const COLONY_CURRENT_VERSION_KEY = 'colony';

export const NETWORK_INVERSE_FEE_DATABASE_ID = 'networkInverseFee';

export const SUPPORTED_EXTENSION_IDS = [
  Extension.OneTxPayment,
  Extension.VotingReputation,
  Extension.StakedExpenditure,
  Extension.StagedExpenditure,
  Extension.StreamingPayments,
];

export const SIMPLE_DECISIONS_ACTION_CODE = '0x12345678';
