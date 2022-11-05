import { EventEmitter } from 'events';
import dotenv from 'dotenv';

import { verbose, sortByPriority } from './utils';
import { ContractEvent, QueueEvents, ContractEventsSignatures, contractEventsPriorityMap } from './types';
import eventProcessor from './eventProcessor';

dotenv.config();

class EventQueue extends EventEmitter {
  queue: ContractEvent[];

  constructor (options?: Record<string, unknown>) {
    super(options);
    this.queue = [];
  }
}

const eventQueue = new EventQueue();

/*
 * Process a individual queue event
 */
eventQueue.on(QueueEvents.ProcessEvent, function (this: EventQueue, event: ContractEvent) {
  verbose('Processing event:', event.signature);
  eventProcessor(event);
});

/*
 * @TODO Add batching logic (if needed)
 *
 * Start processing events from the queue
 */
eventQueue.on(QueueEvents.ProcessEvents, function (this: EventQueue) {
  verbose('Processing', this.queue.length, 'events in queue');
  for (let index = 0; index < this.queue.length; index += 1) {
    this.emit(QueueEvents.ProcessEvent, this.queue.shift());
  }
});

/*
 * Sort the current queue
 */
eventQueue.on(QueueEvents.QueueUpdated, function (this: EventQueue) {
  if (this.queue.length) {
    this.queue = this.queue.sort(sortByPriority(
      'signature',
      contractEventsPriorityMap,
    ));
  }
  verbose('Event queue updated');
  this.emit(QueueEvents.ProcessEvents);
});

/*
 * Add a new event to the queue
 */
eventQueue.on(QueueEvents.NewEvent, function (this: EventQueue, event: ContractEvent) {
  this.queue.push(event);
  verbose('Event added to the queue:', event?.signature || ContractEventsSignatures.UknownEvent);
  this.emit(QueueEvents.QueueUpdated);
});

/*
 * Once your contract event lister finds a new event, pass it to
 * the Events Queue System using this method
 */
export const addEvent = (event: ContractEvent): boolean => eventQueue.emit(QueueEvents.NewEvent, event);
