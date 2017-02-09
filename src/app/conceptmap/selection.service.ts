import { Injectable } from '@angular/core';

import { ConceptComponent } from './concept.component';
import { PropositionComponent } from './proposition.component';

/**
 * Class implementing this interface will be managed by selection service and get notified on selecting and deselecting
 */
export interface Selectable {
  select(): void;
  deselect(): void;
}

/**
 * SelectionService is used to mark elements as selected.
 */
@Injectable()
export class SelectionService {
  selectedConceptComponent: ConceptComponent[] = [];
  selectedPropositionComponent: PropositionComponent[] = [];

  addConceptComponent(component: ConceptComponent) {
    if (this.selectedConceptComponent.indexOf(component) === -1) {
      this.selectedConceptComponent.push(component);
      component.select();
    }
  }

  addPropositionComponent(component: PropositionComponent) {
    if (this.selectedPropositionComponent.indexOf(component) === -1) {
      this.selectedPropositionComponent.push(component);
      component.select();
    }
  }

  removeConceptComponent(component: ConceptComponent) {
    let index = this.selectedConceptComponent.indexOf(component);
    if (index !== -1) {
      this.selectedConceptComponent.splice(index, 1);
      component.deselect();
    }
  }

  removePropositionComponent(component: PropositionComponent) {
    let index = this.selectedPropositionComponent.indexOf(component);
    if (index !== -1) {
      this.selectedPropositionComponent.splice(index, 1);
      component.deselect();
    }
  }

  clear() {
    for (let c of this.selectedConceptComponent) {
      c.deselect();
    }
    for (let c of this.selectedPropositionComponent) {
      c.deselect();
    }
    this.selectedPropositionComponent = [];
    this.selectedConceptComponent = [];
  }

}

