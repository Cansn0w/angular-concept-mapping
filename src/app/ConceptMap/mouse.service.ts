import { Injectable } from '@angular/core';

/**
 * Represent objects that is used to record the state of the user's mouse.
 */
class ButtonState {

  pressed: boolean;
  target: any;

  constructor (target: any = undefined, pressed: boolean = false) {
    this.pressed = pressed;
    this.target = target;
  }

}

/**
 * MouseService is used to monitor the user's mouse action across the app.
 */
@Injectable()
export class MouseService {

  state = {}

  pressedOn(target: any, button: number = 1) {
    this.state[button] = new ButtonState(target, true);
  }

  releasedOn(target: any, button: number = 1) {
    this.state[button] = new ButtonState(target, false);
  }

  isPressed(button: number = 1) {
    if (this.state[button]) {
      return this.state[button].pressed;
    }
    return false;
  }
}
