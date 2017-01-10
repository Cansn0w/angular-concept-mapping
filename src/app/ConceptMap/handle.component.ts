import { Component, Input, DoCheck } from '@angular/core';

import { Concept, ConceptMap, Proposition } from './conceptmap.types';
import { Task, MouseService  } from './mouse.service';
import { ConceptComponent } from './concept.component';

/**
 * Handle component. used to create propositions.
 * This component is draggable so the user can create propositions by dragging from a concept to another.
 */
@Component({
  selector: 'cm-handle',
  templateUrl: './handle.component.html',
  styleUrls: ['./conceptmap.component.css']
})
export class HandleComponent implements DoCheck {

  @Input() from: ConceptComponent;

  x: number;
  y: number;

  conceptPosition = {x: -1, y: -1};

  constructor(
    private mouse: MouseService,
    private cmap: ConceptMap
    ) { }

  ngDoCheck() {
    // check if the belonging concept moved and update position if needed
    if (this.from.concept.x !== this.conceptPosition.x || this.from.concept.y !== this.conceptPosition.y) {
      this.conceptPosition.x = this.from.concept.x;
      this.conceptPosition.y = this.from.concept.y;
      this.x = this.from.concept.x;
      this.y = this.from.concept.y - 32;
    }
  }

  createProposition(from: Concept, to: Concept) {
    // Check if there is already a proposition
    for (let i of this.cmap.propositions) {
      if (i.from === from && i.to === to || i.from === to && i.to === from) {
        return;
      }
    }
    this.cmap.propositions.push(new Proposition('', from, to));  // todo - replace stub
  }

  linePath() {
    return [
      'M', this.from.concept.x, this.from.concept.y,
      'L', this.x, this.y
    ].join(' ');
  }

  mouseDown(event) {
    this.mouse.pressedOn(this, event);
    if (event.which === 1) {
      let dragTask = new Task(this.mouse, 'mousemove', (e, unregister) => {
        this.x += e.movementX;
        this.y += e.movementY;
      });

      new Task(this.mouse, 'mouseup', (e, unregister) => {
        if (e.which === 1)  {
          setTimeout(() => {
            // todo - replace this error prone structure
            if (this.mouse.state[1].target && this.mouse.state[1].target.concept) {
              this.createProposition(this.from.concept, this.mouse.state[1].target.concept);
            }
            this.x = this.from.concept.x;
            this.y = this.from.concept.y - 32;
            dragTask.unRegister();
            unregister();
          }, 0);
        }
      });
    }
    event.stopPropagation();
  }
}
