import { BigNumber } from 'ethers';
import { TransactionDescription } from 'ethers/lib/utils';

import { ContractEvent, motionNameMapping } from '~types';
import {
  getDomainDatabaseId,
  getExpenditureDatabaseId,
  toNumber,
} from '~utils';
import { query } from '~amplifyClient';
import {
  GetExpenditureDocument,
  GetExpenditureQuery,
  GetExpenditureQueryVariables,
} from '~graphql';

import { createMotionInDB } from '../../helpers';

export default async (
  event: ContractEvent,
  { name, args: actionArgs }: TransactionDescription,
  gasEstimate: BigNumber,
): Promise<void> => {
  const { colonyAddress } = event;
  const [, , expenditureId] = actionArgs;
  const convertedExpenditureId = toNumber(expenditureId);

  if (!colonyAddress) {
    return;
  }

  const databaseId = getExpenditureDatabaseId(
    colonyAddress,
    convertedExpenditureId,
  );

  const response = await query<
    GetExpenditureQuery,
    GetExpenditureQueryVariables
  >(GetExpenditureDocument, {
    id: databaseId,
  });
  const domainId = response?.data?.getExpenditure?.nativeDomainId;

  await createMotionInDB(event, {
    type: motionNameMapping[name],
    fromDomainId:
      colonyAddress && domainId
        ? getDomainDatabaseId(colonyAddress, domainId)
        : undefined,
    gasEstimate: gasEstimate.toString(),
    expenditureId: getExpenditureDatabaseId(
      colonyAddress,
      toNumber(expenditureId),
    ),
  });
};
