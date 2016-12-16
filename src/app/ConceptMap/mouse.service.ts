import { Injectable } from '@angular/core';

/**
 * Represent objects that is used to record the state of the user's mouse.
 */
class ButtonState {

  pressed: boolean;
  target: any;
  event: any;

  constructor (target: any = undefined, pressed: boolean = false, event: any = undefined) {
    this.pressed = pressed;
    this.target = target;
    this.event = event;
  }

}

/**
 * This interface enforces the command design pattern,
 * which allows components to create command objects to be executed later under different condition.
 */
interface Executable {
  execute(event: any): void;
}

/**
 * MouseService is used to monitor the user's mouse action across the app.
 * This class implements the Observer design pattern, where components can register with it,
 * and registered callback will be executed on different condition.
 */
@Injectable()
export class MouseService {

  state = {}
  movement: any;
  events = {
    "mousedown": [],
    "mouseup": [],
    "mousemove": []
  }

  private doTasks(event: string, browserEvent: any) {
    for (let e of this.events[event].slice(0)) {
      e.execute(browserEvent);
    }
  }

  register(action: string, task: Executable) {
    this.events[action].push(task);
  }

  unRegister(action: string, task: Executable) {
    let index = this.events[action].indexOf(task);
    if (index !== -1) {
      this.events[action].splice(index);
    }
  }

  pressedOn(target: any, event: any) {
    // todo - This structure is error prone as the state changes so tasks are tricker to design
    this.doTasks("mousedown", event);
    this.state[event.which] = new ButtonState(target, true, event);
  }

  releasedOn(target: any, event: any) {
    // todo - This structure is error prone as the state changes so tasks are tricker to design
    this.doTasks("mouseup", event);
    this.state[event.which] = new ButtonState(target, false, event);
  }

  moved(event) {
    //  this condition filters some movement events that are actually not moved on Chrome
    if (event.movementX !== 0 || event.movementY !== 0) {
      this.doTasks("mousemove", event);
      this.movement = event;
    }
  }

  hasDragged(button: number) {
    return this.movement.timeStamp > this.state[button].event.timeStamp;
  }

  isPressed(button: number = 1) {
    if (this.state[button]) {
      return this.state[button].pressed;
    }
    return false;
  }
}

/**
 * Helter class which register and unregister itself on construction and task completion.
 */
export class Task implements Executable {

  event: string;
  callback: (any: any, unregister: ()=>void)=> void;
  service: MouseService;

  /**
   * Create a task object which register itself with the sevice system,
   * Callback can accept a browser event,
   * and an unregistration function which unregister the task conditionally.
   * @constructor
   */
  constructor(service: MouseService, event: string, callback: (browserEvent: any, unregister: ()=>void)=> void) {
    this.event = event;
    this.callback = callback;
    this.service = service;
    this.service.register(this.event, this);
  }

  execute(browserEvent: any): void {
    this.callback(browserEvent, ()=>{ this.unRegister(); });
  }

  unRegister() {
    this.service.unRegister(this.event, this);
  }
}
