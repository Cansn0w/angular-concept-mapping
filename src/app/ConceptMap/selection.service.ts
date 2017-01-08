import { Injectable } from '@angular/core';

/**
 * Class implementing this interface will be observing selection events, and will be notified on selecting and deselecting
 */
export interface Selectable {
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
    if (this.selected.indexOf(obj) === -1) {
      this.selected.push(obj);
      obj.select();
    }
  }

  remove(obj: Selectable) {
    let index = this.selected.indexOf(obj);
    if (index !== -1) {
      this.selected.splice(index, 1);
      obj.deselect();
    }
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

