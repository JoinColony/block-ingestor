import { ColonyActionType } from '~graphql';
import { createMotionInDB } from '~handlers/motions/motionCreated/helpers';
import { ContractMethodSignatures } from '~types';
import {
  getDomainDatabaseId,
  getExpenditureDatabaseId,
  toNumber,
} from '~utils';
import { MulticallHandler, MulticallValidator } from './types';

export const isReleaseStagedPaymentsMotion: MulticallValidator = ({
  decodedFunctions,
}) => {
  return decodedFunctions.every(
    (decodedFunction) =>
      decodedFunction.functionSignature ===
      ContractMethodSignatures.ReleaseStagedPaymentViaArbitration,
  );
};

export const releaseStagedPaymentsMotionHandler: MulticallHandler = async ({
  colonyAddress,
  event,
  decodedFunctions,
}) => {
  const [, , domainId] = event.args;

  // @NOTE: This handler assumes the multicall is releasing stages of a single expenditure
  const expenditureId = decodedFunctions[0]?.args[4];
  const slotIds = decodedFunctions.map((decodedFunction) =>
    toNumber(decodedFunction.args[5]),
  );

  await createMotionInDB(colonyAddress, event, {
    type: ColonyActionType.ReleaseStagedPaymentsMotion,
    fromDomainId: colonyAddress
      ? getDomainDatabaseId(colonyAddress, domainId)
      : undefined,
    expenditureId: getExpenditureDatabaseId(
      colonyAddress,
      toNumber(expenditureId),
    ),
    expenditureSlotIds: slotIds,
  });
};
