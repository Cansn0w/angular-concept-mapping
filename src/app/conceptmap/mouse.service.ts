import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/first';

/**
 * An event wrapper that also records the component emitted this event.
 */
class MouseEvent {

  component: any;
  browserEvent: any;

  constructor(component, event) {
    this.component = component;
    this.browserEvent = event;
  }
}

/**
 * MouseService, deals with user interaction.
 * This service operates on rxjs Subject to make events observable
 * and also provides drag handling.
 */
@Injectable()
export class MouseService {

  cursorStyle = 'default';
  position = {x: 0, y: 0};  // cursor position

  mouseMoveEvents = new Subject<MouseEvent>();
  mouseUpEvents = new Subject<MouseEvent>();
  mouseDownEvents = new Subject<MouseEvent>();

  /**
   * Should be called when there is a mouse down event
   */
  down(sourceComponent: any, event: any) {
    this.mouseDownEvents.next(new MouseEvent(sourceComponent, event));
  }

  /**
   * Should be called when there is a mouse up event
   */
  up(sourceComponent: any, event: any) {
    this.mouseUpEvents.next(new MouseEvent(sourceComponent, event));
  }

  /**
   * Should be called when there is a mouse move event
   * this function uses customised movement calculation and also filters zero distance movements.
   */
  move(sourceComponent: any, event: any) {
    Object.defineProperty(event, 'movementX', {value : event.clientX - this.position.x});
    Object.defineProperty(event, 'movementY', {value : event.clientY - this.position.y});

    this.position.x = event.clientX;
    this.position.y = event.clientY;
    //  this condition filters some mousemove events that are actually not moved on Chrome
    if (event.movementX !== 0 || event.movementY !== 0) {
      this.mouseMoveEvents.next(new MouseEvent(sourceComponent, event));
    }
  }

  /**
   * Subscribe to drag operation
   * Should be called after a mouse down event
   * OnDrag callback will be executed on every mouse move, and OnDragEnd will be executed on mouse up.
   */
  drag(onDrag: (mouseEvent: MouseEvent) => void, onDragEnd: (mouseEvent: MouseEvent) => void) {
    const mouseMoveSub = this.mouseMoveEvents.subscribe(onDrag);
    this.mouseUpEvents.first().subscribe(
      event => {
        onDragEnd(event);
        mouseMoveSub.unsubscribe();
      }
    );
  }

}
