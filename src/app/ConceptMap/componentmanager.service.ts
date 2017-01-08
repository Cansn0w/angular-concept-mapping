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
  conceptComponents: ConceptComponent[] = [];
  propositionComponents: PropositionComponent[] = [];

  addConceptComponent(component: ConceptComponent) {
    this.conceptComponents.push(component);
  }

  getConceptComponent(concept: Concept) {
    return this.conceptComponents[this.conceptComponents.findIndex((element) => {
      return element.concept === concept;
    })];
  }

  removeConceptComponent(component: ConceptComponent) {
    this.conceptComponents.splice(this.conceptComponents.indexOf(component), 1);
  }

  addPropositionComponent(component: PropositionComponent) {
    this.propositionComponents.push(component);
  }

  removePropositionComponent(component: PropositionComponent) {
    this.propositionComponents.splice(this.propositionComponents.indexOf(component), 1);
  }
}
