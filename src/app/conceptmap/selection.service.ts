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
  selectedConceptComponent = new Set<ConceptComponent>();
  selectedPropositionComponent = new Set<PropositionComponent>();

  addConceptComponent(component: ConceptComponent) {
    this.selectedConceptComponent.add(component);
    component.select();
  }

  addPropositionComponent(component: PropositionComponent) {
    this.selectedPropositionComponent.add(component);
    component.select();
  }

  removeConceptComponent(component: ConceptComponent) {
    if (this.selectedConceptComponent.delete(component)) {
      component.deselect();
    }
  }

  removePropositionComponent(component: PropositionComponent) {
    if (this.selectedPropositionComponent.delete(component)) {
      component.deselect();
    }
  }

  clear() {
    this.selectedConceptComponent.forEach(c => c.deselect());
    this.selectedPropositionComponent.forEach(c => c.deselect());
    this.selectedPropositionComponent.clear();
    this.selectedConceptComponent.clear();
  }

}

