import { ContractEvent } from '~types';
import { DecodedFunctions } from './multicall';
import { ExpenditureFragment, ExpenditureStatus } from '~graphql';
import {
  editLockedExpenditureMotionHandler,
  fundExpenditureMotionHandler,
  isEditLockedExpenditureMotion,
  isFundExpenditureMotion,
  isReleaseExpenditureStageMotion,
  releaseExpenditureStageMotionHandler,
} from './multicallHandlers';

export type MulticallHandler = ({
  event,
  decodedFunctions,
  gasEstimate,
  expenditure,
}: {
  event: ContractEvent;
  gasEstimate: string;
  decodedFunctions: DecodedFunctions;
  expenditure?: ExpenditureFragment;
}) => void | Promise<void>;

export type MulticallValidator = ({
  decodedFunctions,
  expenditureStatus,
}: {
  decodedFunctions: DecodedFunctions;
  expenditureStatus?: ExpenditureStatus;
}) => boolean;

export const multicallHandlers: Array<[MulticallValidator, MulticallHandler]> =
  [
    [isFundExpenditureMotion, fundExpenditureMotionHandler],
    [isReleaseExpenditureStageMotion, releaseExpenditureStageMotionHandler],
    [isEditLockedExpenditureMotion, editLockedExpenditureMotionHandler],
  ];

// List all supported multicall fragments
export const supportedMulticallFragments: string[] = [
  'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,address)',
  'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,address)',
  'setExpenditureState',
  'setExpenditurePayout(uint256,uint256,uint256,uint256,address,uint256)',
];
