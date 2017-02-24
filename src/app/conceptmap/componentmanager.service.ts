import { Injectable } from '@angular/core';

import { ConceptComponent } from './concept.component';
import { PropositionComponent } from './proposition.component';
import { Concept } from './conceptmap.types';

/**
 * Component Manager service collects all component so communication could be easier.
 * All concept and proposition component should register them self into the manager upon initiation.
 */
@Injectable()
export class ComponentManager {
  conceptComponents = new Set<ConceptComponent>();
  propositionComponents = new Set<PropositionComponent>();

  addConceptComponent(component: ConceptComponent) {
    this.conceptComponents.add(component);
  }

  getConceptComponent(concept: Concept) {
    return Array.from(this.conceptComponents).find(c => c.concept === concept);
  }

  removeConceptComponent(component: ConceptComponent) {
    this.conceptComponents.delete(component);
  }

  addPropositionComponent(component: PropositionComponent) {
    this.propositionComponents.add(component);
  }

  removePropositionComponent(component: PropositionComponent) {
    this.propositionComponents.delete(component);
  }
}
