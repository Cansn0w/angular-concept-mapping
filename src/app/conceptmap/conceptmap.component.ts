import { Component, HostListener, HostBinding, DoCheck } from '@angular/core';

import { ConceptMap } from './conceptmap.types';
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
  selector: 'cm-concept-map',
  templateUrl: './conceptmap.component.html',
  styleUrls: ['./conceptmap.component.css']
})
export class ConceptMapComponent implements DoCheck {

  @HostBinding('style.cursor') protected cursorStyle = 'default';

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
    if (this.selection.selectedConceptComponent.size === 1 && this.selection.selectedPropositionComponent.size === 0) {
      return this.selection.selectedConceptComponent.values().next().value;
    }
    return undefined;
  }

  import(data: string) {
    this.selection.clear();
    this.cmap.parseJson(data);
  }

  export(): string {
    return this.cmap.toJson();
  }

  deleteSelected() {
    Array.from(this.manager.propositionComponents).filter(p => p.selected).forEach(p => this.cmap.removeProposition(p.proposition));
    Array.from(this.manager.conceptComponents).filter(c => c.selected).forEach(c => this.cmap.removeConcept(c.concept));
    this.selection.clear();
  }

  selectAll() {
    this.selection.clear();
    this.manager.conceptComponents.forEach(concept => this.selection.addConceptComponent(concept));
  }

  @HostListener('dblclick', ['$event']) protected doubleClick(event) {
    this.cmap.addConcept('', event.clientX, event.clientY);
  }

  @HostListener('mousedown', ['$event']) protected mouseDown(event) {
    this.mouse.down(this, event);
    if (event.which === 1) {
      if (event.altKey) {
        this.mouse.drag(
          e => {
            this.mouse.cursorStyle = 'move';
            this.cmap.concepts.forEach(c => {
              c.x += e.browserEvent.movementX;
              c.y += e.browserEvent.movementY;
            });
          },
          e => {
            if (e.browserEvent.which === 1)  {
              this.mouse.cursorStyle = 'default';
            }
          }
        );
      } else {
        if (!event.ctrlKey) {
          this.selection.clear();
        }
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
            // todo: better control-select operation
            this.manager.conceptComponents.forEach(c => {
              if (this.rubberband.include(c.concept.x, c.concept.y)) {
                this.selection.addConceptComponent(c);
              } else {
                this.selection.removeConceptComponent(c);
              }
            });
            this.manager.propositionComponents.forEach(p => {
              if (this.rubberband.include(p.labelX, p.labelY)) {
                this.selection.addPropositionComponent(p);
              } else {
                this.selection.removePropositionComponent(p);
              }
            });
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
