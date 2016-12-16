import { ConceptComponent } from './concept.component';
import { Injectable } from '@angular/core';


export interface Selectable {
  select(): void;
  deselect(): void;
  isSelected(): boolean;
}

/**
 * SelectionService is used to mark elements as selected and to act on the collection of selected elements.
 */
@Injectable()
export class SelectionService {
  selected: Selectable[] = [];  // todo - consider replacing array with set

  add(obj: Selectable) {
    obj.select();
    this.selected.push(obj);
  }

  remove(obj: Selectable) {
    obj.deselect();
    this.selected.splice(this.selected.indexOf(obj), 1);
  }

  clear() {
    for (let obj of this.selected) {
      obj.deselect();
    }
    this.selected = [];
  }

  apply(operation: (element) => void) {
    for (let obj of this.selected) {
      operation(obj);
    }
  }

  isEmpty() {
    return this.selected.length === 0;
  }
}

