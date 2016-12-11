import { ConceptComponent } from './concept.component';
import { Injectable } from '@angular/core';

/**
 * SelectionService is used to mark elements as selected and to act on the collection of selected elements.
 */
@Injectable()
export class SelectionService {
  selected: ConceptComponent[] = [];  // todo - consider replacing array with set

  private deselect(c: ConceptComponent) {
    c.selected = false;
    c.editable = false;
  }

  clear() {
    for (let c of this.selected) {
      this.deselect(c);
    }
    this.selected = [];
  }

  add(concept: ConceptComponent) {
    concept.selected = true;
    this.selected.push(concept);
  }

  remove(concept: ConceptComponent) {
    this.deselect(concept);
    this.selected.splice(this.selected.indexOf(concept), 1);
  }

  hasSelected(concept: ConceptComponent) {
    return this.selected.indexOf(concept) !== -1;
  }

  isEmpty() {
    return this.selected.length === 0;
  }
}

