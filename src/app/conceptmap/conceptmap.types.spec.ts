
import { Concept, Proposition, ConceptMap } from './conceptmap.types';

/**
 * Helper function that return an array of randomly generated concepts.
 */
function getConcepts(number: number) {
  const list: Concept[] = [];
  for (let i = 0; i < number; i ++) {
    list.push(new Concept(
      Math.floor(Math.random() * 0xffff).toString(16),
      Math.floor(Math.random() * 0xffff),
      Math.floor(Math.random() * 0xffff)
      ));
  }
  return list;
}

function edgesInACompeleteGraph(n_vertices: number) {
  const n = n_vertices - 1;
  return n + (n * (n - 1)) / 2;  // Sum of arithmetic series
}

describe('Test concept map data structure', () => {
  let map: ConceptMap;

  beforeEach(() => {
    map = new ConceptMap();
  });

  it('can add and remove concepts', () => {

    const concepts = getConcepts(200);

    expect(map.concepts.size).toEqual(0);

    for (const i of concepts) {
      map.addConcept(i.text, i.x, i.y);
    }
    expect(map.concepts.size).toEqual(200);

    for (const i of concepts) {
      expect(Array.from(map.concepts).some((c, idx, arr) => c.x === i.x && c.y === i.y)).toBeTruthy();
    }

    for (const i of Array.from(map.concepts).slice(100)) {
      map.removeConcept(i);
    }
    expect(map.concepts.size).toEqual(100);

    for (const i of Array.from(map.concepts)) {
      map.removeConcept(i);
    }
    expect(map.concepts.size).toEqual(0);
  });

  it('can add and remove Propositions', () => {
    const concepts = getConcepts(5);
    const propositions: Proposition[] = [];
    for (const i of concepts) {
      for (const j of concepts) {
        if (i !== j) {
          propositions.push(new Proposition(i.text + j.text, i, j));
        }
      }
    }

    expect(map.propositions.size).toEqual(0);

    for (const p of propositions) {
      map.addProposition(p.text, p.from, p.to);
    }
    expect(map.propositions.size).toEqual(edgesInACompeleteGraph(5) * 2);

    for (const i of propositions) {
      expect(Array.from(map.propositions).some((c, idx, arr) => c.from === i.from && c.to === i.to)).toBeTruthy();
    }

    for (const p of Array.from(map.propositions)) {
      map.removeProposition(p);
    }
    expect(map.propositions.size).toEqual(0);
  });

  it('removing concepts also removes dependent propositions', () => {

    const nConcepts = 10;
    const concepts = getConcepts(nConcepts);

    expect(map.concepts.size).toEqual(0);

    for (const i of concepts) {
      map.addConcept(i.text, i.x, i.y);
    }
    expect(map.concepts.size).toEqual(nConcepts);

    for (const i of Array.from(map.concepts)) {
      for (const j of Array.from(map.concepts)) {
        if (i !== j) {
          map.addProposition(i.text + j.text, i, j);
        }
      }
    }
    expect(map.propositions.size).toEqual(edgesInACompeleteGraph(nConcepts) * 2);

    map.removeConcept(Array.from(map.concepts)[0]);
    expect(map.propositions.size).toEqual(edgesInACompeleteGraph(nConcepts - 1) * 2);

    map.removeConcept(Array.from(map.concepts)[0]);
    expect(map.propositions.size).toEqual(edgesInACompeleteGraph(nConcepts - 2) * 2);
  });

  it('can encode and decode a map', () => {

    const nConcepts = 30;

    for (const i of getConcepts(nConcepts)) {
      map.addConcept(i.text, i.x, i.y);
    }
    expect(map.concepts.size).toEqual(nConcepts);

    const concepts = Array.from(map.concepts);
    for (let i = 0; i < concepts.length; i ++) {
      for (let j = 0; j < i; j ++) {
        map.addProposition(concepts[i].text + concepts[j].text, concepts[i], concepts[j]);
      }
    }
    expect(map.propositions.size).toEqual(edgesInACompeleteGraph(nConcepts));

    const mapJSON = map.toJson();

    const newMap = new ConceptMap();

    newMap.parseJson(mapJSON);

    expect(newMap.concepts.size).toEqual(map.concepts.size);
    for (const i of Array.from(map.concepts)) {
      expect(Array.from(newMap.concepts).some((c, idx, arr) => i.x === c.x && i.y === c.y)).toBeTruthy();
    }

    expect(newMap.propositions.size).toEqual(map.propositions.size);
    for (const i of Array.from(map.propositions)) {
      expect(Array.from(newMap.propositions).some(
        (p, idx, arr) => i.from.x === p.from.x && i.from.y === p.from.y && i.to.x === p.to.x && i.to.y === p.to.y)
        ).toBeTruthy();
    }
  });
});
