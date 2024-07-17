import {
  editLockedExpenditureMotionHandler,
  isEditLockedExpenditureMotion,
} from './editLockedExpenditureMotion';
import {
  editStreamingPaymentMotionHandler,
  isEditStreamingPaymentMotion,
} from './editStreamingPaymentMotion';
import {
  fundExpenditureMotionHandler,
  isFundExpenditureMotion,
} from './fundExpenditureMotion';
import { MulticallHandler, MulticallValidator } from './types';

export const multicallHandlers: Array<[MulticallValidator, MulticallHandler]> =
  [
    [isFundExpenditureMotion, fundExpenditureMotionHandler],
    [isEditLockedExpenditureMotion, editLockedExpenditureMotionHandler],
    [isEditStreamingPaymentMotion, editStreamingPaymentMotionHandler],
  ];
