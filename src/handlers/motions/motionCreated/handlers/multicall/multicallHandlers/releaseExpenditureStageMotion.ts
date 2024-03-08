import { ColonyActionType, ExpenditureStatus } from '~graphql';
import { toNumber } from 'lodash';
import { getDomainDatabaseId, getExpenditureDatabaseId } from '~utils';
import { DecodedFunctions } from '../multicall';
import { ContractEvent } from '~types';
import { createMotionInDB } from '~handlers/motions/motionCreated/helpers';

export const isReleaseExpenditureStageMotion = (
  decodedFunctions: DecodedFunctions,
  expenditureStatus: ExpenditureStatus,
): boolean => {
  const fragmentsToMatch = ['setExpenditureState'];
  return (
    expenditureStatus === ExpenditureStatus.Finalized &&
    decodedFunctions.every((decodedFunction) =>
      fragmentsToMatch.includes(decodedFunction.fragment),
    )
  );
};

export const releaseExpenditureStageMotionHandler = (
  event: ContractEvent,
  gasEstimate: string,
  decodedFunctions: DecodedFunctions,
): void => {
  decodedFunctions.forEach(async (decodedFunction) => {
    const { colonyAddress } = event;
    const [, , expenditureId, , , keys] = decodedFunction.decodedAction;
    const [, , domainId] = event.args;
    const [slotId] = keys;

    if (!colonyAddress) {
      return;
    }

    await createMotionInDB(event, {
      type: ColonyActionType.SetExpenditureStateMotion,
      fromDomainId: getDomainDatabaseId(colonyAddress, domainId),
      gasEstimate: gasEstimate.toString(),
      expenditureId: getExpenditureDatabaseId(
        colonyAddress,
        toNumber(expenditureId),
      ),
      expenditureSlotId: toNumber(slotId),
    });
  });
};
