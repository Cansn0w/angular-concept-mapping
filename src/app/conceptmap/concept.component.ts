import { Component, Input, HostListener, HostBinding, ElementRef, OnInit, OnDestroy } from '@angular/core';

import { Concept } from './conceptmap.types';
import { MouseService  } from './mouse.service';
import { SelectionService, Selectable } from './selection.service';
import { ComponentManager } from './componentmanager.service';
import { keyMatch } from './etc';

/**
 * Concept component. Define the concept html element.
 */
@Component({
  selector: 'cm-concept',
  template: '',
})
export class ConceptComponent implements OnInit, OnDestroy, Selectable {

  @Input() concept: Concept;

  @HostBinding('class.selected') selected: boolean = false;

  @HostBinding('class.prevent-select') preventSelect: boolean = true;

  @HostBinding('attr.contenteditable') editable: boolean = false;

  constructor(
    protected selection: SelectionService,
    protected mouse: MouseService,
    protected manager: ComponentManager,
    protected element: ElementRef
  ) { }

  get height() {
    return this.element.nativeElement.offsetHeight;
  }

  get width() {
    return this.element.nativeElement.offsetWidth;
  }

  ngOnInit() {
    this.manager.addConceptComponent(this);
    // get focus on creation
    if (!this.concept.text) {
      window.setTimeout(() => {
        this.selection.clear();
        this.selection.addConceptComponent(this);
        this.enableEdit();
      }, 0);
    }
  }

  ngOnDestroy() {
    this.manager.removeConceptComponent(this);
  }

  select() {
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
    this.preventSelect = true;
  }

  @HostListener('mousedown', ['$event']) mouseDown(event) {
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
                  this.selection.removeConceptComponent(this);
                }
              }
            );
          } else {
            this.selection.addConceptComponent(this);
          }
        } else {
          if (this.selected) {
            let dragged = false;
            this.mouse.drag(
              e => dragged = true,
              e => {
                if (e.browserEvent.which === 1 && !dragged) {
                  this.selection.clear();
                  this.selection.addConceptComponent(this);
                }
              }
            );
          } else {
            this.selection.clear();
            this.selection.addConceptComponent(this);
          }
        }

        this.mouse.drag(
          e => {
            this.mouse.cursorStyle = 'move';
            this.selection.selectedConceptComponent.forEach((c) => {
              c.concept.x += e.browserEvent.movementX;
              c.concept.y += e.browserEvent.movementY;
            });
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

  @HostListener('mouseup', ['$event']) mouseUp(event) {
    this.mouse.up(this, event);
    event.stopPropagation();
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

  @HostListener('keydown', ['$event']) keyDown(event) {
    if (keyMatch(event, 'A', {ctrl: true}) || (event.key === 'Delete' || event.key === 'Del' || event.which === 46)) {
      event.stopPropagation();
    }
    console.log(event);
    setTimeout(() => {}, 0);  // used to manually trigger angular life cycle check to detect element size change.
  }

}
