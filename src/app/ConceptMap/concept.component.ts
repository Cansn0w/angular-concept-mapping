import { Component, Input, HostListener, HostBinding, ElementRef } from '@angular/core';

import { Concept } from './conceptmap.types';
import { Task, MouseService  } from './mouse.service';
import { SelectionService  } from './selection.service';

/**
 * Concept component. Define the concept html element.
 */
@Component({
	selector: 'cm-concept',
  template: '{{ concept.text }}',
})
export class ConceptComponent {

  @Input() concept: Concept;

  constructor(
    private selection: SelectionService,
    private mouse: MouseService,
    private element: ElementRef
    ) { }

  @HostBinding("class.selected") selected: boolean = false;

  @HostBinding("attr.contenteditable") editable: boolean = false;

  @HostBinding("style.user-select") selectable: string = "none";

  enableEdit(target) {
    this.selectable = "text";
    this.editable = true;
    window.setTimeout(()=>{
      target.focus();
      var range = document.createRange();
      range.selectNodeContents(target);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }, 0)
  }

  disableEdit() {
    this.editable = false;
    this.selectable = "none";
  }

  @HostListener("dblclick", ["$event"]) doubleClick(event) {
    event.stopPropagation();
    if (!this.editable) {
      this.enableEdit(event.target);
    }
  }

  ngOnInit() {
    if(!this.concept.text) {
      this.selection.add(this);
      this.enableEdit(this.element.nativeElement);
    }
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

  @HostListener('mouseup', ['$event']) mouseUp(event) {
    this.mouse.releasedOn(this, event);
  }

}
