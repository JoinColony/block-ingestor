// import provider from '~provider';
// import { Block, ContractEventsSignatures, EthersObserverEvents } from '~types';
// import { getClient, output, mapLogToContractEvent, notNull } from '~utils';
// import {
//   addColonyEventListener,
//   getListenersLogTopics,
//   getMatchingListener,
// } from './listeners';
// import { addEvent } from '~eventQueue';
// import {
//   ListColoniesDocument,
//   ListColoniesQuery,
//   ListColoniesQueryVariables,
// } from '~graphql';
// import { query } from '~amplifyClient';
// import EventEmitter from 'events';

// let latestBlockNumber: number | null = null;
// const currentBlockQueue: Block[] = [];
// const blocks: Record<number, Block> = {};
// let isProcessing = false;

// const setupEventListenersForColonies = async (): Promise<void> => {

//   colonies.filter(notNull).forEach((colony) => {
//     addColonyEventListener(
//       ContractEventsSignatures.DomainAdded,
//       colony.id,
//       () => {
//         console.log('Domain Added!');
//       },
//     );
//     addColonyEventListener(
//       ContractEventsSignatures.DomainMetadata,
//       colony.id,
//       () => {
//         console.log('Domain Metadata!');
//       },
//     );
//   });
// };

// export const startNewIngestor = (): void => {
//   setupEventListenersForColonies();
//   eventQueue();
// };

// const eventQueue = async () => {
//   if (!latestBlockNumber || isProcessing) {
//     return;
//   }

//   isProcessing = true;

//   let currentBlockNumber = latestBlockNumber + 1;
//   while (blocks[currentBlockNumber]) {
//     console.log(`Processing block ${currentBlockNumber}`);

//     const block = blocks[currentBlockNumber];

//     const logs = await provider.getLogs({
//       fromBlock: block.number,
//       toBlock: block.number,
//       topics: getListenersLogTopics(),
//     });

//     const events = [];

//     for (const log of logs) {
//       const listener = getMatchingListener(log.topics, log.address);
//       if (!listener) {
//         continue;
//       }

//       const client = await getClient(listener.clientType, log.address);
//       if (!client) {
//         continue;
//       }

//       const event = await mapLogToContractEvent(log, client.interface);
//       if (!event) {
//         continue;
//       }

//       listener.handler(event);
//     }

//     latestBlockNumber = currentBlockNumber;
//     currentBlockNumber++;
//   }

//   isProcessing = false;
// };

// const emitter = new EventEmitter();
// emitter.on('blockAdded', () => {
//   eventQueue();
// });
