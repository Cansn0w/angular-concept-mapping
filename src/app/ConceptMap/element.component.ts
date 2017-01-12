import { Component } from '@angular/core';

import { MouseService } from './mouse.service';
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

  select() { }

  deselect(): void {
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
    this.mouse.down(this, event);
    if (event.which === 1) {
      if (!this.editable /* disable drag while been editable */) {

        if (event.ctrlKey || event.shiftKey) {
          if (this.selected) {
            let dragged = false;
            this.mouse.drag(
              e => dragged = true,
              e => {
                if (e.browserEvent.which === 1 && !dragged) {
                  this.selection.remove(this);
                }
              }
            );
          } else {
            this.selection.add(this);
          }
        } else {
          if (this.selected) {
            let dragged = false;
            this.mouse.drag(
              e => dragged = true,
              e => {
                if (e.browserEvent.which === 1 && !dragged) {
                  this.selection.select(this);
                }
              }
            );
          } else {
            this.selection.select(this);
          }
        }

        this.mouse.drag(
          e => {
            this.mouse.cursorStyle = 'move';
            for (let c of this.manager.conceptComponents) {
              if (c.selected) {
                c.concept.x += e.browserEvent.movementX;
                c.concept.y += e.browserEvent.movementY;
              }
            }
          },
          e => {
            if (e.browserEvent.which === 1)  {
              this.mouse.cursorStyle = 'default';
            }
          }
        );

      }
    }
    event.stopPropagation();
  }

  mouseUp(event) {
    this.mouse.up(this, event);
    event.stopPropagation();
  }

  keyDown(event) {
    if (event.key.toUpperCase() === 'A' && event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.stopPropagation();
    }
  }

}
