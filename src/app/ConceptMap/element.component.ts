import { Component } from '@angular/core';

import { MouseService, Task  } from './mouse.service';
import { SelectionService, Selectable } from './selection.service';
import { ComponentManager } from './componentmanager.service';

/**
 * Base element component. controls selection, draging and editing.
 */
@Component({})
export class ElementComponent implements Selectable {

  selected: boolean = false;

  preventSelect: boolean = true;

  editable: boolean = false;

  constructor(
    protected selection: SelectionService,
    protected mouse: MouseService,
    protected manager: ComponentManager
  ) { }

  select(): void {
    this.selected = true;
  }

  deselect(): void {
    this.selected = false;
    if (this.editable) {
      this.disableEdit();
    }
  }

  enableEdit() {
    this.editable = true;
    this.preventSelect = false;
  }

  disableEdit() {
    this.editable = false;
    this.preventSelect = true;
  }

  doubleClick(event) {
    event.stopPropagation();
    // when not selecting
    if (!event.ctrlKey && !event.shiftKey) {
      if (!this.editable) {
        this.enableEdit();
      }
    }
  }

  mouseDown(event) {
    this.mouse.pressedOn(this, event);
    if (event.which === 1) {
      // disable drag while been editable
      if (!this.editable) {
        if (event.ctrlKey || event.shiftKey) {
          if (this.selected) {
            new Task(this.mouse, 'mouseup', (e, unregister) => {
              if (e.which === 1) {
                if (!this.mouse.hasDragged(1)) {
                  this.selection.remove(this);
                }
                unregister();
              }
            });
          } else {
            this.selection.add(this);
          }
        } else {
          if (this.selected) {
            new Task(this.mouse, 'mouseup', (e, unregister) => {
              if (e.which === 1) {
                if (!this.mouse.hasDragged(1)) {
                  this.selection.select(this);
                }
                unregister();
              }
            });
          } else {
            this.selection.select(this);
          }
        }

        let dragTask = new Task(this.mouse, 'mousemove', (e, unregister) => {
          this.mouse.cursorStyle = 'move';
          this.selection.apply((element) => {
            if (element.concept) {
              element.concept.x += e.movementX;
              element.concept.y += e.movementY;
            }
          });
        });

        new Task(this.mouse, 'mouseup', (e, unregister) => {
          if (e.which === 1)  {
            this.mouse.cursorStyle = 'default';
            dragTask.unRegister();
            unregister();
          }
        });
      }
    }
    event.stopPropagation();
  }

  mouseUp(event) {
    this.mouse.releasedOn(this, event);
    event.stopPropagation();
  }

}
