import { ContractEvent } from '~types';
import {
  addStakedExpenditureParamsToDB,
  getStakedExpenditureClient,
} from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { colonyAddress } = event;

  if (!colonyAddress) {
    return;
  }

  const stakedExpenditureClient = await getStakedExpenditureClient(
    colonyAddress,
  );

  if (!stakedExpenditureClient) {
    return;
  }

  await addStakedExpenditureParamsToDB(
    stakedExpenditureClient?.address,
    colonyAddress,
  );
};
