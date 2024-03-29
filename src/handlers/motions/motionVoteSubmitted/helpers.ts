import { BigNumber } from 'ethers';
import { VoterRecord } from '~graphql';

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
        vote: null,
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
        vote: null,
      };
      return updatedRecord;
    }

    return record;
  });
};
