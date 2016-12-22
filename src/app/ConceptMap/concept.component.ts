import { Component, Input, HostListener, HostBinding, ElementRef, OnInit } from '@angular/core';

import { Concept } from './conceptmap.types';
import { ElementComponent } from './element.component';
import { MouseService  } from './mouse.service';
import { SelectionService } from './selection.service';

/**
 * Concept component. Define the concept html element.
 */
@Component({
  selector: 'cm-concept',
  template: '{{ concept.text }}',
})
export class ConceptComponent extends ElementComponent implements OnInit {

  @Input() concept: Concept;

  @HostBinding('class.selected') selected: boolean = false;

  @HostBinding('class.prevent-select') preventSelect: boolean = true;

  @HostBinding('attr.contenteditable') editable: boolean = false;

  constructor(
    selection: SelectionService,
    mouse: MouseService,
    private element: ElementRef
  ) {
    super(selection, mouse);
  }

  ngOnInit() {
    if (!this.concept.text) {
      window.setTimeout(() => {
        this.selection.select(this);
        this.enableEdit();
      }, 0);
    }
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
