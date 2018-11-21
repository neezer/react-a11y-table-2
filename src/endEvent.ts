import { currentTime } from "@most/scheduler";
import { Scheduler, Sink, Time } from "@most/types";
import EventEmitter from "eventemitter3";

export class EndEvent {
  private emitter: EventEmitter;
  private event: string;

  constructor(emitter: EventEmitter, event: string) {
    this.emitter = emitter;
    this.event = event;
  }

  public run(sink: Sink<true>, scheduler: Scheduler) {
    const send = (value: true) => tryEvent(currentTime(scheduler), value, sink);

    const dispose = () => {
      this.emitter.removeListener(this.event, send);
    };

    this.emitter.on(this.event, send);

    return { dispose };
  }
}

function tryEvent(t: Time, x: true, sink: Sink<true>) {
  try {
    sink.event(t, x);
  } catch (e) {
    sink.error(t, e);
  }
}
