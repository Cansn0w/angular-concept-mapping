import { Component, Input, OnChanges, DoCheck } from '@angular/core';

import { Concept, ConceptMap, Proposition } from './conceptmap.types';
import { MouseService  } from './mouse.service';
import { ConceptComponent } from './concept.component';

import { ie } from './etc';

/**
 * Handle component. used to create propositions.
 * This component is draggable so the user can create propositions by dragging from a concept to another.
 */
@Component({
  selector: 'cm-handle',
  templateUrl: './handle.component.html',
  styleUrls: ['./conceptmap.component.css']
})
export class HandleComponent implements DoCheck, OnChanges {

  @Input() from: ConceptComponent;

  x: number;
  y: number;

  conceptPosition = {x: -1, y: -1, height: -1};
  dragged: boolean;

  constructor(
    private mouse: MouseService,
    private cmap: ConceptMap
  ) { }

  get ie () {
    return ie;
  }

  ngOnChanges() {
    this.x = this.from.concept.x;
    this.y = this.from.concept.y - this.from.height / 2 - 16;
  }

  ngDoCheck() {
    // check if the belonging concept moved and update position if needed
    if (
      this.from.concept.x !== this.conceptPosition.x
      ||
      this.from.concept.y !== this.conceptPosition.y
      ||
      this.from.height !== this.conceptPosition.height
    ) {
      this.conceptPosition.x = this.from.concept.x;
      this.conceptPosition.y = this.from.concept.y;
      this.conceptPosition.height = this.from.height;
      this.x = this.from.concept.x;
      this.y = this.from.concept.y - this.from.height / 2 - 16;
    }
  }

  createProposition(from: Concept, to: Concept) {
    if (!Array.from(this.cmap.propositions).some(p => p.from === from && p.to === to || p.from === to && p.to === from)) {
      this.cmap.propositions.add(new Proposition('', from, to));
    }
  }

  linePath() {
    return [
      'M', this.from.concept.x, this.from.concept.y,
      'L', this.x, this.y
    ].join(' ');
  }

  mouseDown(event) {
    this.mouse.down(this, event);
    if (event.which === 1) {
      this.mouse.drag(
        e => {
          this.dragged = true;
          this.x = this.mouse.position.x;
          this.y = this.mouse.position.y;
        },
        e => {
          if (e.browserEvent.which === 1) {
            if (e.component.concept) {
              this.createProposition(this.from.concept, e.component.concept);
            }
            this.dragged = false;
            this.x = this.from.concept.x;
            this.y = this.from.concept.y - this.from.height / 2 - 16;
          }
        }
      );
    }
    event.stopPropagation();
  }
}
