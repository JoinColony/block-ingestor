import { Extension } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { toB32 } from '~utils';

export const COLONY_CURRENT_VERSION_KEY = 'colony';
export const NETWORK_INVERSE_FEE_DATABASE_ID = 'networkInverseFee';

export const SUPPORTED_EXTENSION_IDS = [
  Extension.OneTxPayment,
  Extension.VotingReputation,
  Extension.StakedExpenditure,
  Extension.StagedExpenditure,
  Extension.StreamingPayments,
  Extension.MultisigPermissions,
];

export const SIMPLE_DECISIONS_ACTION_CODE = '0x12345678';
export const BLOCK_PAGING_SIZE = process.env.BLOCK_PAGING_SIZE
  ? parseInt(process.env.BLOCK_PAGING_SIZE, 10)
  : 1000;

// These are indexes of data slots in contracts
// For more information: https://github.com/JoinColony/colonyNetwork/blob/develop/contracts/colony/ColonyStorage.sol
export const EXPENDITURES_SLOT = BigNumber.from(25);
export const EXPENDITURESLOTS_SLOT = BigNumber.from(26);

export const EXPENDITURE_OWNER_AND_STATUS = toB32(BigNumber.from(0));

export const EXPENDITURESLOT_RECIPIENT = toB32(BigNumber.from(0));
export const EXPENDITURESLOT_CLAIMDELAY = toB32(BigNumber.from(1));
export const EXPENDITURESLOT_PAYOUTMODIFIER = toB32(BigNumber.from(2));
