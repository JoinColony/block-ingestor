/*
 * All contract method signatures we deal with
 */
export enum ContractMethodSignatures {
  MoveFundsBetweenPots = 'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,address)',
  MoveFundsBetweenPots_OLD = 'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,address)',
  setExpenditureState = 'setExpenditureState',
  setExpenditurePayout = 'setExpenditurePayout(uint256,uint256,uint256,uint256,address,uint256)',
}
