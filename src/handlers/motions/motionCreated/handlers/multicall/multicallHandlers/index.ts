import {
  editLockedExpenditureMotionHandler,
  isEditLockedExpenditureMotion,
} from './editLockedExpenditureMotion';
import {
  fundExpenditureMotionHandler,
  isFundExpenditureMotion,
} from './fundExpenditureMotion';
import { MulticallHandler, MulticallValidator } from './types';

export const multicallHandlers: Array<[MulticallValidator, MulticallHandler]> =
  [
    [isFundExpenditureMotion, fundExpenditureMotionHandler],
    [isEditLockedExpenditureMotion, editLockedExpenditureMotionHandler],
  ];
