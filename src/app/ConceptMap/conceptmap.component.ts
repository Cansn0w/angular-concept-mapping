import { Component, HostListener, HostBinding, DoCheck } from '@angular/core';

import { Concept, ConceptMap } from './conceptmap.types';
import { Task, MouseService  } from './mouse.service';
import { SelectionService  } from './selection.service';
import { ComponentManager } from './componentmanager.service';

/**
 * Concept Map component. Define the concept map html element.
 * This element generates a number of concept and propositon elements to create a concept map.
 */
@Component({
  selector: 'concept-map',
  templateUrl: './conceptmap.component.html',
  styleUrls: ['./conceptmap.component.css']
})
export class ConceptMapComponent implements DoCheck {

  @HostBinding('style.cursor') cursorStyle: string = 'default';

  constructor(
    private selection: SelectionService,
    private mouse: MouseService,
    private cmap: ConceptMap,
    private manager: ComponentManager
  ) { }

  ngDoCheck() {
    this.cursorStyle = this.mouse.cursorStyle;
  }

  /**
   * This method will return a single concept component if it's the only selected one, otherwise undefined
   */
  get getSingleSelection() {
    if (this.selection.selected.length === 1) {
      let c: any = this.selection.selected[0];
      if (c.concept) {
        return c;
      }
    }
    return undefined;
  }

  @HostListener('window:keydown', ['$event']) keyDown(event) {
    // delete
    if (event.key === 'Delete') {
      this.selection.apply((element) => {
        if (element.concept) {
          this.cmap.removeConcept(element.concept);
        } else {
          this.cmap.removeProposition(element.proposition);
        }
      });
      this.selection.clear();
    } else
    // select all
    if (event.key.toUpperCase() === 'A' && event.ctrlKey && !event.shiftKey && !event.altKey) {
      this.selection.clear();
      for (let concept of this.manager.conceptComponents) {
        this.selection.add(concept);
      }
    }
  }

  @HostListener('dblclick', ['$event']) doubleClick(event) {
    this.cmap.concepts.push(new Concept('', event.x, event.y));
  }

  @HostListener('mousedown', ['$event']) mouseDown(event) {
    this.mouse.pressedOn(undefined, event);
    if (event.which === 1 && !event.ctrlKey) {
      this.selection.clear();
    }

    if (event.ctrlKey) {
      let dragTask = new Task(this.mouse, 'mousemove', (e, unregister) => {
        this.mouse.cursorStyle = 'move';
        for (let c of this.cmap.concepts) {
          c.x += e.movementX;
          c.y += e.movementY;
        }
      });

      new Task(this.mouse, 'mouseup', (e, unregister) => {
        if (e.which === 1)  {
          this.mouse.cursorStyle = 'default';
          dragTask.unRegister();
          unregister();
        }
      });
    }
  }

  @HostListener('mouseup', ['$event']) mouseUp(event) {
    this.mouse.releasedOn(undefined, event);
  }

  @HostListener('mousemove', ['$event']) mouseMove(event) {
    this.mouse.moved(event);
  }

}
