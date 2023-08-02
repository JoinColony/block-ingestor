import { utils } from 'ethers';
import { mutate } from '~amplifyClient';
import {
  CreateExpenditureDocument,
  CreateExpenditureMutation,
  CreateExpenditureMutationVariables,
  ExpenditureStatus,
} from '~graphql';
import provider from '~provider';
import { ContractEvent, ContractEventsSignatures } from '~types';
import {
  getCachedColonyClient,
  getExpenditureDatabaseId,
  mapLogToContractEvent,
  output,
  toNumber,
  verbose,
} from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { contractAddress: colonyAddress, transactionHash } = event;
  const { agent: ownerAddress, expenditureId } = event.args;
  const convertedExpenditureId = toNumber(expenditureId);

  const receipt = await provider.getTransactionReceipt(transactionHash);
  const fundingPotAddedLog = receipt.logs.find(
    (log) =>
      log.topics[0] === utils.id(ContractEventsSignatures.FundingPotAdded),
  );

  if (!fundingPotAddedLog) {
    output(
      'No FundingPotAdded event found in transaction receipt containing ExpenditureAdded event',
    );
    return;
  }

  const colonyClient = await getCachedColonyClient(colonyAddress);
  if (!colonyClient) {
    return;
  }

  const fundingPotAddedEvent = await mapLogToContractEvent(
    fundingPotAddedLog,
    colonyClient.interface,
  );
  if (!fundingPotAddedEvent) {
    return;
  }

  const fundingPotId = toNumber(fundingPotAddedEvent.args.fundingPotId);

  verbose(
    'Expenditure with ID',
    convertedExpenditureId,
    'added in Colony:',
    colonyAddress,
  );

  await mutate<CreateExpenditureMutation, CreateExpenditureMutationVariables>(
    CreateExpenditureDocument,
    {
      input: {
        id: getExpenditureDatabaseId(colonyAddress, convertedExpenditureId),
        colonyId: colonyAddress,
        nativeId: convertedExpenditureId,
        ownerAddress,
        status: ExpenditureStatus.Draft,
        slots: [],
        nativeFundingPotId: fundingPotId,
      },
    },
  );
};
