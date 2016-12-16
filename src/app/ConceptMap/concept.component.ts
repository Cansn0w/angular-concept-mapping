import { Component, Input, HostListener, HostBinding, ElementRef, OnInit } from '@angular/core';

import { Concept } from './conceptmap.types';
import { Task, MouseService  } from './mouse.service';
import { SelectionService, Selectable } from './selection.service';

/**
 * Concept component. Define the concept html element.
 */
@Component({
  selector: 'cm-concept',
  template: '{{ concept.text }}',
})
export class ConceptComponent implements Selectable, OnInit {

  @Input() concept: Concept;

  @HostBinding('class.selected') selected: boolean = false;

  @HostBinding('style.user-select') selectable: string = 'none';

  @HostBinding('attr.contenteditable') editable: boolean = false;

  constructor(
    private selection: SelectionService,
    private mouse: MouseService,
    private element: ElementRef
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

  isSelected(): boolean {
    return this.selected;
  }

  enableEdit() {
    this.selectable = 'text';
    this.editable = true;
    window.setTimeout(() => {
      this.element.nativeElement.focus();
      let range = document.createRange();
      range.selectNodeContents(this.element.nativeElement);
      let sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }, 0);
  }

  disableEdit() {
    this.editable = false;
    this.selectable = 'none';
  }

  ngOnInit() {
    if (!this.concept.text) {
      window.setTimeout(() => {
        this.selection.select(this);
        this.enableEdit();
      }, 0);
    }
  }

  @HostListener('dblclick', ['$event']) doubleClick(event) {
    event.stopPropagation();
    // when not selecting
    if (!event.ctrlKey && !event.shiftKey) {
      if (!this.editable) {
        this.enableEdit();
      }
    }
  }

  @HostListener('mousedown', ['$event']) mouseDown(event) {
    this.mouse.pressedOn(this.concept, event);
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
          this.selection.apply((element) => {
            if (element.concept) {
              element.concept.x += e.movementX;
              element.concept.y += e.movementY;
            }
          });
        });

        new Task(this.mouse, 'mouseup', (e, unregister) => {
          if (e.which === 1)  {
            dragTask.unRegister();
            unregister();
          }
        });
      }
    }
    event.stopPropagation();
  }

  @HostListener('mouseup', ['$event']) mouseUp(event) {
    this.mouse.releasedOn(this, event);
    event.stopPropagation();
  }

}
