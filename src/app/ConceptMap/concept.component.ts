import { Component, Input, HostListener, HostBinding } from '@angular/core';

import { Concept } from './conceptmap.types';
import { MouseService  } from './mouse.service';
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
    private mouse: MouseService
    ) { }

  @HostListener('mousedown', ['$event']) mouseDown(event) {
    if (event.which === 1) {
      this.selection.clear();
      this.selection.add(this.concept);

      this.mouse.pressedOn(this.concept, event.which);
      event.stopPropagation();
    }
  }

  @HostListener('mouseup', ['$event']) mouseUp(event) {
    if (event.which === 1) {
      this.mouse.releasedOn(this.concept, event.which);
    }
  }

}
