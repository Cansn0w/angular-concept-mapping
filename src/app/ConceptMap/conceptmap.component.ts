import { Component, HostListener, HostBinding } from '@angular/core';

import { Concept, ConceptMap, Proposition } from './conceptmap.types';
import { Task, MouseService  } from './mouse.service';
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

  @HostBinding('style.cursor') cursorStyle: string = "default";

  constructor(
    private selection: SelectionService,
    private mouse: MouseService,
    private cmap: ConceptMap
  ) { }

  @HostListener('window:keydown', ['$event']) keyDown(event) {
    if (event.key === "Delete") {
      this.selection.apply((element) => {
        if (element.concept) {
          this.cmap.removeConcept(element.concept);
        } else {
          this.cmap.removeProposition(element.proposition);
        }
      })
      this.selection.clear()
    }
  }

  @HostListener("dblclick", ["$event"]) doubleClick(event) {
    this.cmap.concepts.push(new Concept('', event.x, event.y));
  }

  @HostListener('mousedown', ['$event']) mouseDown(event) {
    this.mouse.pressedOn(undefined, event);
    if (event.which === 1 && !event.ctrlKey) {
      this.selection.clear();
    }

    if (event.ctrlKey) {
      let dragTask = new Task(this.mouse, "mousemove", (event, unregister)=> {
        this.cursorStyle = "move";
        for (let c of this.cmap.concepts) {
          c.x += event.movementX;
          c.y += event.movementY;
        }
      })

      new Task(this.mouse, "mouseup", (event, unregister)=> {
        if (event.which === 1)  {
        this.cursorStyle = "default";
          dragTask.unRegister();
          unregister();
        }
      })
    }
  }

  @HostListener('mouseup', ['$event']) mouseUp(event) {
    this.mouse.releasedOn(undefined, event);
  }

  @HostListener('mousemove', ['$event']) mouseMove(event) {
    this.mouse.moved(event);
  }

}
