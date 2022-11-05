import { EventEmitter } from 'events';
import dotenv from 'dotenv';

import { output, sortByPriority } from './utils';
import { ContractEvent, QueueEvents, ContractEventsSignatures } from './types';
import eventProcessor from './eventProcessor';

dotenv.config();

class EventQueue extends EventEmitter {
  queue: ContractEvent[];

  constructor () {
    super();

    this.queue = [];
  }
}

const eventQueue = new EventQueue();

eventQueue.on(QueueEvents.ProcessEvent, function (this: EventQueue, event: ContractEvent) {
  output(`Processing event "${event.signature}"`);
  eventProcessor(event);
});

eventQueue.on(QueueEvents.ProcessEvents, function (this: EventQueue) {
  output('Processing', this.queue.length, 'events in queue');
  for (let index = 0; index < this.queue.length; index += 1) {
    this.emit(QueueEvents.ProcessEvent, this.queue.shift());
  }
});

eventQueue.on(QueueEvents.QueueUpdated, function (this: EventQueue) {
  if (this.queue.length) {
    this.queue = this.queue.sort(sortByPriority(
      'signature',
      /*
       * Sort priority for events
       *
       * If negative priority, it will be relegated to the back of the array
       * If not listed it will be sorted after the ones with priority set, and
       * before the ones with negative priority
       */
      {
        [ContractEventsSignatures.NativeTokenTransfer]: 1,
        [ContractEventsSignatures.Transfer]: 2,
        [ContractEventsSignatures.ColonyFundsClaimed]: 3,
        [ContractEventsSignatures.UknownEvent]: -1,
      },
    ));
  }
  output('Event queue updated');
  this.emit(QueueEvents.ProcessEvents);
});

eventQueue.on(QueueEvents.NewEvent, function (this: EventQueue, event: ContractEvent) {
  this.queue.push(event);
  output(`Event "${event?.signature || ContractEventsSignatures.UknownEvent}" added to the queue`);
  this.emit(QueueEvents.QueueUpdated);
});

export const addEvent = (event: ContractEvent): boolean => eventQueue.emit(QueueEvents.NewEvent, event);
