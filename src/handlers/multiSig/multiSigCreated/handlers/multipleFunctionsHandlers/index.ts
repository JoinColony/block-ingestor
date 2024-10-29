import {
  fundExpenditureMultisigHandler,
  isFundExpenditureMultisig,
} from './fundExpenditure';
import { MultipleFunctionsHandler, MultipleFunctionsValidator } from './types';

export const multipleFunctionsHandlers: Array<
  [MultipleFunctionsValidator, MultipleFunctionsHandler]
> = [[isFundExpenditureMultisig, fundExpenditureMultisigHandler]];
