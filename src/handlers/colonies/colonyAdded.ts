import { colonySpecificEventsListener } from '~eventListener';
import { coloniesSet } from '~trackColonies';
import { ContractEvent } from '~types';
import { output, updateStats } from '~utils';

export default async (event: ContractEvent): Promise<void> => {
  const { colonyAddress, token: tokenAddress } = event.args ?? {};

  /*
   * Add it to the Set
   */
  coloniesSet.add(JSON.stringify({ colonyAddress, tokenAddress }));
  await updateStats({ trackedColonies: coloniesSet.size });

  output(
    'Found new Colony:',
    colonyAddress,
    'Total tracked colonies:',
    coloniesSet.size,
  );

  /*
   * Setup all Colony specific listeners for it
   */
  await colonySpecificEventsListener(colonyAddress);
};
