import { Component, Input, HostListener, HostBinding, ElementRef, OnInit, OnDestroy } from '@angular/core';

import { Concept } from './conceptmap.types';
import { ElementComponent } from './element.component';
import { MouseService  } from './mouse.service';
import { SelectionService } from './selection.service';
import { ComponentManager } from './componentmanager.service';

/**
 * Concept component. Define the concept html element.
 */
@Component({
  selector: 'cm-concept',
  template: '',
})
export class ConceptComponent extends ElementComponent implements OnInit, OnDestroy {

  @Input() concept: Concept;

  @HostBinding('class.selected') selected: boolean = false;

  @HostBinding('class.prevent-select') preventSelect: boolean = true;

  @HostBinding('attr.contenteditable') editable: boolean = false;

  constructor(
    protected selection: SelectionService,
    protected mouse: MouseService,
    protected manager: ComponentManager,
    protected element: ElementRef
  ) {
    super(selection, mouse, manager);
  }

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
        this.selection.select(this);
        this.enableEdit();
      }, 0);
    }
  }

  ngOnDestroy() {
    this.manager.removeConceptComponent(this);
  }

  enableEdit() {
    super.enableEdit();

    // todo - replace with more portable implemetation.
    window.setTimeout(() => {
      this.element.nativeElement.focus();
      let range = document.createRange();
      range.selectNodeContents(this.element.nativeElement);
      let sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }, 0);
  }

  @HostListener('keydown', ['$event']) keyDown(event) {
    super.keyDown(event);
  }

  @HostListener('dblclick', ['$event']) doubleClick(event) {
    super.doubleClick(event);
  }

  @HostListener('mousedown', ['$event']) mouseDown(event) {
    super.mouseDown(event);
  }

  @HostListener('mouseup', ['$event']) mouseUp(event) {
    super.mouseUp(event);
  }

}
