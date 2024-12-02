import { verbose } from '@joincolony/utils';
import { EventListener } from './types';

export class EventManager {
  private listeners: EventListener[] = [];

  public getEventListeners(): EventListener[] {
    return this.listeners;
  }

  public setEventListeners(newListeners: EventListener[]): void {
    this.listeners = newListeners;
  }

  public addEventListener(listener: EventListener): void {
    verbose(
      `Added listener for event ${listener.eventSignature}`,
      listener.address ? `filtering address ${listener.address}` : '',
    );
    this.listeners.push(listener);
  }

  public getMatchingListeners(
    logTopics: string[],
    logAddress: string,
  ): EventListener[] {
    return this.listeners.filter((listener) => {
      if (listener.address && logAddress !== listener.address) {
        return false;
      }

      if (listener.topics.length > logTopics.length) {
        return false;
      }

      return listener.topics.every((topic, index) => {
        return (
          topic === null ||
          topic.toLowerCase() === logTopics[index].toLowerCase()
        );
      });
    });
  }

  public getListenersStats(): string {
    return JSON.stringify(this.listeners);
  }
}
