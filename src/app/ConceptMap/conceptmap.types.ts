import { Injectable } from '@angular/core';

/**
 * Represent concepts in concept maps.
 */
export class Concept {
  text: string;
  id: string;
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

  /**
   * Export a concept map to JSON format
   * will convert all concepts to an id.
   */
  toJson() {
    let map = {
      concepts: [],
      propositions: []
    };

    // Efforts to avoid id collisions - not sure whether necessary :/
    let lookup = {};

    for (let c of this.concepts) {
      if (c.id) {
        lookup[c.id] = c;
      }
    }

    for (let c of this.concepts) {
       if (!c.id) {
         let id = randomHex();
         while (lookup[id]) {
           id = randomHex();
         }
        c.id = id;
        lookup[c.id] = c;
      }
    }

    map.concepts = this.concepts;

    for (let p of this.propositions) {
      map.propositions.push({
        text: p.text,
        from: p.from.id,
        to: p.to.id
      });
    }

    return JSON.stringify(map);
  }

  /**
   * Parse a JSON string into a concept map
   * will overwrite current map if loaded successfully
   */
  parseJson(data: string) {
    let map = JSON.parse(data);

    let concepts = [];
    let propositions = [];

    let lookup = {};
    for (let c of map.concepts) {
      let concept = new Concept(c.text, c.x, c.y);
      concept.id = c.id;
      lookup[c.id] = concept;
      concepts.push(concept);
    }

    for (let p of map.propositions) {
      propositions.push(new Proposition(p.text, lookup[p.from], lookup[p.to]));
    }

    this.concepts = concepts;
    this.propositions = propositions;
  }
}
