/*
 * All contract method signatures we deal with
 */
export enum ContractMethodSignatures {
  MoveFundsBetweenPots = 'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,address)',
  SetExpenditureState = 'setExpenditureState',
  SetExpenditurePayout = 'setExpenditurePayout(uint256,uint256,uint256,uint256,address,uint256)',
  ReleaseStagedPaymentViaArbitration = 'releaseStagedPaymentViaArbitration(uint256,uint256,uint256,uint256,uint256,uint256,address[])',
}
