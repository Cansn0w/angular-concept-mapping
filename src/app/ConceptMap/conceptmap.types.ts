import { Injectable } from '@angular/core';

/**
 * Represent concepts in concept maps.
 */
export class Concept {
  text: string;
  x: number;
  y: number;

  constructor(text: string, x: number, y: number) {
    this.text = text;
    this.x = x;
    this.y = y;
  }
}

/**
 * Represent propositions in concept maps. It points from one concept to another
 */
export class Proposition {
  text: string;
  from: Concept;
  to: Concept;

  constructor(text: string, from: Concept, to: Concept) {
    this.text = text;
    this.from = from;
    this.to = to;
  }
}

/**
 * A collection of concepts and propositions.
 */
@Injectable()
export class ConceptMap {

  concepts: Concept[] = [];
  propositions: Proposition[] = [];

  addConcept(text: string, x: number, y: number) {
    this.concepts.push(new Concept(text, x, y));
  }

  addProposition(text: string, from: Concept, to: Concept) {
    this.propositions.push(new Proposition(text, from, to));
  }

  removeProposition(prop: Proposition) {
    this.propositions.splice(this.propositions.indexOf(prop), 1);
  }

  /**
   * Remove a concept and all propositions that links to and from it.
   */
  removeConcept(concept: Concept) {
    this.concepts.splice(this.concepts.indexOf(concept), 1);
    let toDelete = [];
    for (let p of this.propositions) {
      if (p.from === concept || p.to === concept) {
        toDelete.push(p);
      }
    }
    for (let p of toDelete) {
      this.removeProposition(p);
    }
  }

}
