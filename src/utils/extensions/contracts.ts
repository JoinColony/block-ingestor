import { Contract } from 'ethers';

import { ContractEventsSignatures } from '~types';

/**
 * Function returning OneTxPayment contract, currently used for handling the Payment action
 */
export const getOneTxPaymentContract = (address: string): Contract =>
  new Contract(address, [`event ${ContractEventsSignatures.OneTxPaymentMade}`]);
