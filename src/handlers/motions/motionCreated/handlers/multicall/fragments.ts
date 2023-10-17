import { Result } from 'ethers/lib/utils';
import { ContractEvent } from '~types';
import {
  moveFundsBetweenPotsMulti,
  setExpenditureStateMulti,
} from './multicallHandlers';

type MultiCallHandler = ({
  args,
  event,
  gasEstimate,
}: {
  event: ContractEvent;
  args: Result;
  gasEstimate: string;
}) => Promise<void>;
// Here we list tuples with the fragments that we are aware of that use multicall, and the corresponding handler
// we want to fire if the fragment was included in the multicall event.
export const multicallFragments: Array<[string, MultiCallHandler]> = [
  [
    'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,address)',
    moveFundsBetweenPotsMulti,
  ],
  [
    'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,address)',
    moveFundsBetweenPotsMulti,
  ],
  ['setExpenditureState', setExpenditureStateMulti],
];
