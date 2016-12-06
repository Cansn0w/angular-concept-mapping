import { Concept } from './conceptmap.types';
import { Injectable } from '@angular/core';

/**
 * SelectionService is used to mark elements as selected and to act on the collection of selected elements.
 */
@Injectable()
export class SelectionService {
  selected: Concept[] = [];  // todo - consider replacing array with set

  clear() {
    for (let c of this.selected) {
      c.selected = false;
    }
    this.selected = [];
  }

  add(concept: Concept) {
    concept.selected = true;
    this.selected.push(concept);
  }

  isEmpty() {
    return this.selected.length === 0;
  }
}

