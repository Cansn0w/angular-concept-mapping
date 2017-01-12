import { Component, HostListener, HostBinding, DoCheck } from '@angular/core';

import { Concept, ConceptMap } from './conceptmap.types';
import { MouseService } from './mouse.service';
import { SelectionService } from './selection.service';
import { ComponentManager } from './componentmanager.service';

/**
 * Representing the selection rubber band
 */
class RubberBand {
    x: number;
    y: number;
    top: number;
    left: number;
    width: number;
    height: number;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    include(x: number, y: number) {
      return this.top < y && y < this.top + this.height && this.left < x && x < this.left + this.width;
    }
  }

/**
 * Concept Map component. Define the concept map element.
 * This element contains a number of concept and propositon elements to create a concept map.
 */
@Component({
  selector: 'concept-map',
  templateUrl: './conceptmap.component.html',
  styleUrls: ['./conceptmap.component.css']
})
export class ConceptMapComponent implements DoCheck {

  @HostBinding('style.cursor') protected cursorStyle: string = 'default';

  rubberband: RubberBand;

  constructor(
    protected mouse: MouseService,
    public selection: SelectionService,
    public manager: ComponentManager,
    public cmap: ConceptMap,
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

  import(data) {
    this.selection.clear();
    this.cmap.parseJson(data);
  }

  export() {
    return this.cmap.toJson();
  }

  deleteSelected() {
    for (let p of this.manager.propositionComponents) {
      if (p.selected) {
        this.cmap.removeProposition(p.proposition);
      }
    }
    for (let c of this.manager.conceptComponents) {
      if (c.selected) {
        this.cmap.removeConcept(c.concept);
      }
    }
    this.selection.clear();
  }

  selectAll() {
    this.selection.clear();
    for (let concept of this.manager.conceptComponents) {
      this.selection.add(concept);
    }
  }

  @HostListener('dblclick', ['$event']) protected doubleClick(event) {
    this.cmap.concepts.push(new Concept('', event.clientX, event.clientY));
  }

  @HostListener('mousedown', ['$event']) protected mouseDown(event) {
    this.mouse.down(this, event);
    if (event.which === 1) {
      if (event.ctrlKey) {
        this.mouse.drag(
          e => {
            this.mouse.cursorStyle = 'move';
            for (let c of this.cmap.concepts) {
              c.x += e.browserEvent.movementX;
              c.y += e.browserEvent.movementY;
            }
          },
          e => {
            if (e.browserEvent.which === 1)  {
              this.mouse.cursorStyle = 'default';
            }
          }
        );
      } else {
        this.selection.clear();
        this.mouse.drag(
          e => {
            // create rubber band if drag starts.
            if (!this.rubberband) {
              this.rubberband = new RubberBand(this.mouse.position.x, this.mouse.position.y);
            }
            this.rubberband.top = Math.min(this.rubberband.y, this.mouse.position.y);
            this.rubberband.left = Math.min(this.rubberband.x, this.mouse.position.x);
            this.rubberband.width = Math.max(this.rubberband.x, this.mouse.position.x) - this.rubberband.left;
            this.rubberband.height = Math.max(this.rubberband.y, this.mouse.position.y) - this.rubberband.top;
            // select components
            for (let c of this.manager.conceptComponents) {
              if (this.rubberband.include(c.concept.x, c.concept.y)) {
                this.selection.add(c);
              } else {
                this.selection.remove(c);
              }
            }
            for (let p of this.manager.propositionComponents) {
              if (this.rubberband.include(p.x, p.y)) {
                this.selection.add(p);
              } else {
                this.selection.remove(p);
              }
            }
          },
          e => {
            if (e.browserEvent.which === 1)  {
              this.rubberband = undefined;
            }
          }
        );
      }

    }
  }

  @HostListener('mouseup', ['$event']) protected mouseUp(event) {
    this.mouse.up(this, event);
  }

  @HostListener('mousemove', ['$event']) protected mouseMove(event) {
    this.mouse.move(this, event);
  }

}
