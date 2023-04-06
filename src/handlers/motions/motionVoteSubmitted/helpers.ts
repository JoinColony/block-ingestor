import { BigNumber } from 'ethers';
import { VoterRecord } from '~types';

export const getUpdatedVoterRecord = (
  voterRecord: VoterRecord[],
  voterAddress: string,
): VoterRecord[] => {
  const currentVoterRecord = voterRecord.find(
    ({ address }) => address === voterAddress,
  );

  if (!currentVoterRecord) {
    return [
      ...voterRecord,
      {
        address: voterAddress,
        voteCount: '1',
      },
    ];
  }

  return voterRecord.map((record) => {
    const { address } = record;
    if (address === voterAddress) {
      const { voteCount } = currentVoterRecord;
      const updatedRecord: VoterRecord = {
        ...currentVoterRecord,
        voteCount: BigNumber.from(voteCount).add(1).toString(),
      };
      return updatedRecord;
    }

    return record;
  });
};
