import { Injectable } from '@angular/core';

/**
 * Class implementing this interface will be managed by selection service and get notified on selecting and deselecting
 */
export interface Selectable {
  selected: boolean;  // the service will be managing selected state, so objects should only read from this property.
  select(): void;
  deselect(): void;
}

/**
 * SelectionService is used to mark elements as selected.
 */
@Injectable()
export class SelectionService {
  selected: Selectable[] = [];

  /**
   * Select the object and deselect the rest.
   * similar to a clear followed by an add but will not notify the object if its already selected.
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
      this.selected.push(obj);
      obj.selected = true;
      obj.select();
    }
  }

  remove(obj: Selectable) {
    let index = this.selected.indexOf(obj);
    if (index !== -1) {
      this.selected.splice(index, 1);
      obj.selected = false;
      obj.deselect();
    }
  }

  clear() {
    for (let obj of this.selected) {
      obj.selected = false;
      obj.deselect();
    }
    this.selected = [];
  }

  isEmpty() {
    return this.selected.length === 0;
  }
}

