import { EventEmitter } from 'events';
import dotenv from 'dotenv';

import { verbose } from './utils';
import { ContractEvent, QueueEvents, ContractEventsSignatures } from './types';
import eventProcessor from './eventProcessor';

dotenv.config();

class EventQueue extends EventEmitter {
  queue: ContractEvent[];
  processing: boolean;

  constructor(options?: Record<string, unknown>) {
    super(options);
    this.queue = [];
    this.processing = false;
  }

  async processEvents(): Promise<void> {
    this.processing = true;
    while (this.queue.length) {
      const event = this.queue.shift();
      if (event) {
        verbose('Processing event:', event.signature);
        await eventProcessor(event);
      }
    }

    this.processing = false;
  }
}

const eventQueue = new EventQueue();

/*
 * Add a new event to the queue
 */
eventQueue.on(
  QueueEvents.NewEvent,
  async function (this: EventQueue, event: ContractEvent) {
    this.queue.push(event);
    verbose(
      'Event added to the queue:',
      event?.signature || ContractEventsSignatures.UnknownEvent,
    );
    if (!this.processing) {
      await this.processEvents();
    }
  },
);

/*
 * Once your contract event lister finds a new event, pass it to
 * the Events Queue System using this method
 */
export const addEvent = (event: ContractEvent): boolean =>
  eventQueue.emit(QueueEvents.NewEvent, event);
