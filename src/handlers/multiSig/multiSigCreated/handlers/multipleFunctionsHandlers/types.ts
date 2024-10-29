import { TransactionDescription } from 'ethers/lib/utils';
import { ContractEvent } from '~types';

interface MultipleFunctionsHandlerParams {
  colonyAddress: string;
  event: ContractEvent;
  decodedFunctions: TransactionDescription[];
}

export type MultipleFunctionsHandler = (
  params: MultipleFunctionsHandlerParams,
) => void | Promise<void>;

export type MultipleFunctionsValidator = ({
  decodedFunctions,
}: {
  decodedFunctions: TransactionDescription[];
}) => boolean;
