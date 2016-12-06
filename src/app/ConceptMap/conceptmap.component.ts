import { Component, HostListener, HostBinding } from '@angular/core';

import { Concept, ConceptMap, Proposition } from './conceptmap.types';
import { MouseService  } from './mouse.service';
import { SelectionService  } from './selection.service';

/**
 * Concept Map component. Define the concept map html element.
 * This element generates a number of concept and propositon elements to create a concept map.
 */
@Component({
	selector: 'concept-map',
  templateUrl: './conceptmap.component.html',
  styleUrls: ['./conceptmap.component.css']
})
export class ConceptMapComponent {

  cmap: ConceptMap = new ConceptMap();

  @HostBinding('style.cursor') cursorStyle: string = "default";

  constructor(
    private selection: SelectionService,
    private mouse: MouseService
    ) {

    this.cmap.concepts = [new Concept('concept1', 100, 100), new Concept('concept2', 250, 250), new Concept('concept3', 400, 150)]
    this.cmap.propositions = [new Proposition('Prop1', this.cmap.concepts[0], this.cmap.concepts[1]), new Proposition('Prop2', this.cmap.concepts[1], this.cmap.concepts[2])]
  }

  @HostListener('mousedown', ['$event']) mouseDown(event) {
    if (event.which === 1) {
      this.mouse.pressedOn(undefined, event.which);
      this.selection.clear();
    }
  }

  @HostListener('mouseup', ['$event']) mouseUp(event) {
    if (event.which === 1) {
      this.mouse.releasedOn(undefined, event.which);
      this.cursorStyle = "default";
    }
  }

  @HostListener('mousemove', ['$event']) mouseMove(event) {
    if (this.mouse.isPressed(1)) {
      this.cursorStyle = "move";
      let targets = this.selection.isEmpty() ? this.cmap.concepts : this.selection.selected;
      for (let c of targets) {
        c.x += event.movementX;
        c.y += event.movementY;
      }
    }
  }

}
