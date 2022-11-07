import { EventEmitter } from 'events';
import dotenv from 'dotenv';

import { verbose } from './utils';
import { ContractEvent, QueueEvents, ContractEventsSignatures } from './types';
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
 * Do updates to the queue before processing it
 *
 * This originally sorted the the queue list based on priorities, but that is
 * no longer relevant, so we're processing them in the order we're receiving them.
 *
 * In the future we might do "ensure proper order", sort, by getting all events in the
 * queue and sort them based on their log index, so as to ensure they didn't added
 * to the list out of order
 */
eventQueue.on(QueueEvents.QueueUpdated, function (this: EventQueue) {
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
