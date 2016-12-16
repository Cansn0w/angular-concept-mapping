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
  concepts: Concept[];
  propositions: Proposition[];
}
