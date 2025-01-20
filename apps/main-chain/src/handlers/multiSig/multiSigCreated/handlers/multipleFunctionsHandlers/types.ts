import { ContractEvent } from '@joincolony/blocks';
import { TransactionDescription } from 'ethers/lib/utils';

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
