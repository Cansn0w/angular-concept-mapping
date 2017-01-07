import { Injectable } from '@angular/core';


export interface Selectable {
  selected: boolean;
  select(): void;
  deselect(): void;
}

/**
 * SelectionService is used to mark elements as selected and to act on the collection of selected elements.
 */
@Injectable()
export class SelectionService {
  selected: Selectable[] = [];  // todo - consider replacing array with set.

  /**
   * Select the object and deselect the rest.
   * similar to a clear followed by an add
   */
  select(obj: Selectable) {
    let index = this.selected.indexOf(obj);
    if (index === -1) {
      this.clear();
      this.add(obj);
    } else {
      this.selected.splice(index, 1);
      this.clear();
      this.selected.push(obj);
    }
  }

  add(obj: Selectable) {
    if (!obj.selected) {
      obj.select();
      this.selected.push(obj);
    }
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

