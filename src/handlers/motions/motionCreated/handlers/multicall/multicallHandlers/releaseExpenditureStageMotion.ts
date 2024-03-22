import { ColonyActionType, ExpenditureStatus } from '~graphql';
import { toNumber } from 'lodash';
import { getDomainDatabaseId, getExpenditureDatabaseId } from '~utils';
import { createMotionInDB } from '~handlers/motions/motionCreated/helpers';
import { MulticallHandler, MulticallValidator } from '../fragments';
import { ContractMethodSignatures } from '~types';

export const isReleaseExpenditureStageMotion: MulticallValidator = ({
  decodedFunctions,
  expenditureStatus,
}) => {
  const fragmentsToMatch = [ContractMethodSignatures.SetExpenditureState];
  return (
    expenditureStatus === ExpenditureStatus.Finalized &&
    decodedFunctions.every((decodedFunction) =>
      fragmentsToMatch.includes(decodedFunction.fragment),
    )
  );
};

export const releaseExpenditureStageMotionHandler: MulticallHandler = ({
  event,
  gasEstimate,
  decodedFunctions,
}) => {
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
