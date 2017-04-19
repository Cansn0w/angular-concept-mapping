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

function randomHex(range = 0xffffffff) {
  return Math.floor(Math.random() * range).toString(16);
}

/**
 * A collection of concepts and propositions.
 */
@Injectable()
export class ConceptMap {

  concepts: Set<Concept> = new Set<Concept>();
  propositions: Set<Proposition> = new Set<Proposition>();

  getID = randomHex;

  addConcept(text: string, x: number, y: number) {
    this.concepts.add(new Concept(text, x, y));
  }

  addProposition(text: string, from: Concept, to: Concept) {
    this.propositions.add(new Proposition(text, from, to));
  }

  removeProposition(prop: Proposition) {
    this.propositions.delete(prop);
  }

  /**
   * Remove a concept and all propositions that links to and from it.
   */
  removeConcept(concept: Concept) {
    for (const prop of Array.from(this.propositions).filter(p => p.from === concept || p.to === concept)) {
      this.removeProposition(prop);
    }
    this.concepts.delete(concept);
  }

  /**
   * Export a concept map to JSON format
   * will assign every concept with an id.
   */
  toJson() {
    const map = {
      concepts: [],
      propositions: []
    };

    // Efforts to avoid id collisions - not sure whether necessary :/
    const ids = new Set<string>();
    const conceptIDs = new Map<Concept, string>();
    this.concepts.forEach(c => {
      let id = this.getID();
      while (ids.has(id)) {
        id = this.getID();
      }
      ids.add(id);
      conceptIDs.set(c, id);
      map.concepts.push({text: c.text, x: c.x, y: c.y, id: id });
    });

    this.propositions.forEach(p => {
      map.propositions.push({
        text: p.text,
        from: conceptIDs.get(p.from),
        to: conceptIDs.get(p.to)
      });
    });

    return JSON.stringify(map);
  }

  /**
   * Parse a JSON string into a concept map
   * will overwrite current map if loaded successfully
   */
  parseJson(data: string) {
    const map = JSON.parse(data);

    const concepts = new Set<Concept>();
    const propositions = new Set<Proposition>();

    const lookup = {};
    for (const c of map.concepts) {
      const concept = new Concept(c.text, c.x, c.y);
      lookup[c.id] = concept;
      concepts.add(concept);
    }

    for (const p of map.propositions) {
      propositions.add(new Proposition(p.text, lookup[p.from], lookup[p.to]));
    }

    this.concepts = concepts;
    this.propositions = propositions;
  }
}
