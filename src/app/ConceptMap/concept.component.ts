import { Component, Input, HostListener, HostBinding } from '@angular/core';

import { Concept } from './conceptmap.types';
import { Task, MouseService  } from './mouse.service';
import { SelectionService  } from './selection.service';

/**
 * Concept component. Define the concept html element.
 */
@Component({
	selector: 'cm-concept',
  template: ' {{ concept.text }} ',
})
export class ConceptComponent {

  @Input() concept: Concept;
  constructor(
    private selection: SelectionService,
    private mouse: MouseService,
    ) { }

  @HostBinding("class.selected") selected: boolean = false;

  @HostBinding("attr.contenteditable") editable: boolean = false;

  @HostListener("dblclick", ["$event"]) doubleClick(event) {
    if (!this.editable) {
      this.editable = true;
    }
    event.stopPropagation();
  }

  @HostListener('mousedown', ['$event']) mouseDown(event) {
    this.mouse.pressedOn(this.concept, event);
    if (event.which === 1) {
      // disable drag while been editable
      if (!this.editable) {
        if (event.ctrlKey || event.shiftKey) {
          if (this.selection.hasSelected(this)) {
            new Task(this.mouse, "mouseup", (event, unregister) => {
              if (event.which === 1) {
                if (!this.mouse.isDragged(1)) {
                  this.selection.remove(this);
                }
                unregister();
              }
            })
          } else {
            this.selection.add(this);
          }
        } else {
          if (this.selection.hasSelected(this)) {
            new Task(this.mouse, "mouseup", (event, unregister) => {
              if (event.which === 1) {
                if (!this.mouse.isDragged(1)) {
                  this.selection.clear();
                  this.selection.add(this);
                }
                unregister();
              }
            })
          } else {
            this.selection.clear();
            this.selection.add(this);
          }
        }

        let dragTask = new Task(this.mouse, "mousemove", (event, unregister)=> {
            for (let c of this.selection.selected) {
              c.concept.x += event.movementX;
              c.concept.y += event.movementY;
            }
          })
          new Task(this.mouse, "mouseup", (event, unregister)=> {
            if (event.which === 1)  {
              dragTask.unRegister();
              unregister();
            }
          })
        }
      }

    event.stopPropagation();
  }

}
