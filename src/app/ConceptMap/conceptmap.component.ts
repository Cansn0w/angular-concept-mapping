import { Component, HostListener, HostBinding, DoCheck } from '@angular/core';

import { Concept, ConceptMap } from './conceptmap.types';
import { Task, MouseService } from './mouse.service';
import { SelectionService } from './selection.service';
import { ComponentManager } from './componentmanager.service';

import { ie } from './etc';

class RubberBand {
    x: number;
    y: number;
    top: number;
    left: number;
    width: number;
    height: number;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    include(x: number, y: number) {
      return this.top < y && y < this.top + this.height && this.left < x && x < this.left + this.width;
    }
  }

/**
 * Concept Map component. Define the concept map html element.
 * This element generates a number of concept and propositon elements to create a concept map.
 */
@Component({
  selector: 'concept-map',
  templateUrl: './conceptmap.component.html',
  styleUrls: ['./conceptmap.component.css']
})
export class ConceptMapComponent implements DoCheck {

  @HostBinding('style.cursor') cursorStyle: string = 'default';

  rubberband: RubberBand;

  constructor(
    private selection: SelectionService,
    private mouse: MouseService,
    public manager: ComponentManager,
    public cmap: ConceptMap,
  ) { }

  ngDoCheck() {
    this.cursorStyle = this.mouse.cursorStyle;
  }

  /**
   * This method will return a single concept component if it's the only selected one, otherwise undefined
   */
  get getSingleSelection() {
    if (this.selection.selected.length === 1) {
      let c: any = this.selection.selected[0];
      if (c.concept) {
        return c;
      }
    }
    return undefined;
  }

  import(event) {
    let reader = new FileReader();

    reader.onloadend = (e) => {
      this.cmap.parseJson(reader.result);
    };

    reader.readAsText(event.target.files[0]);
  }

  export() {
    if (ie) {
      window.navigator.msSaveBlob(new Blob([this.cmap.toJson()]), 'ConceptMap.json');
    } else {
      // Create a downloadable file through data URI
      // reference http://stackoverflow.com/a/18197341
      let a = document.createElement('a');
      a.style.display = 'none';
      a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.cmap.toJson()));
      a.setAttribute('download', 'ConceptMap.json');

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  @HostListener('window:keydown', ['$event']) keyDown(event) {
    console.log(event);
    // delete
    if (event.key === 'Delete' || event.key === 'Del') {
      this.selection.apply((element) => {
        if (element.concept) {
          this.cmap.removeConcept(element.concept);
        } else {
          this.cmap.removeProposition(element.proposition);
        }
      });
      this.selection.clear();
    } else
    // select all
    if (event.key.toUpperCase() === 'A' && event.ctrlKey && !event.shiftKey && !event.altKey) {
      this.selection.clear();
      for (let concept of this.manager.conceptComponents) {
        this.selection.add(concept);
      }
    } else
    if (event.key.toUpperCase() === 'S' && event.ctrlKey && !event.shiftKey && !event.altKey) {
      this.export();
      event.preventDefault();
    }
  }

  @HostListener('dblclick', ['$event']) doubleClick(event) {
    this.cmap.concepts.push(new Concept('', event.clientX, event.clientY));
  }

  @HostListener('mousedown', ['$event']) mouseDown(event) {
    this.mouse.pressedOn(undefined, event);
    if (event.which === 1) {
      if (event.ctrlKey) {
        let dragTask = new Task(this.mouse, 'mousemove', (e, unregister) => {
          this.mouse.cursorStyle = 'move';
          for (let c of this.cmap.concepts) {
            c.x += e.movementX;
            c.y += e.movementY;
          }
        });

        new Task(this.mouse, 'mouseup', (e, unregister) => {
          if (e.which === 1)  {
            this.mouse.cursorStyle = 'default';
            dragTask.unRegister();
            unregister();
          }
        });
      } else {
        this.selection.clear();
        let dragTask = new Task(this.mouse, 'mousemove', (e, unregister) => {
          // create rubber band if drag starts.
          if (!this.rubberband) {
            this.rubberband = new RubberBand(this.mouse.position.x, this.mouse.position.y);
          }
          this.rubberband.top = Math.min(this.rubberband.y, this.mouse.position.y);
          this.rubberband.left = Math.min(this.rubberband.x, this.mouse.position.x);
          this.rubberband.width = Math.max(this.rubberband.x, this.mouse.position.x) - this.rubberband.left;
          this.rubberband.height = Math.max(this.rubberband.y, this.mouse.position.y) - this.rubberband.top;
          // select components
          for (let c of this.manager.conceptComponents) {
            if (this.rubberband.include(c.concept.x, c.concept.y)) {
              this.selection.add(c);
            }
          }
          for (let p of this.manager.propositionComponents) {
            if (this.rubberband.include(p.x, p.y)) {
              this.selection.add(p);
            }
          }
        });

        new Task(this.mouse, 'mouseup', (e, unregister) => {
          if (e.which === 1)  {
            this.rubberband = undefined;
            dragTask.unRegister();
            unregister();
          }
        });
      }
    }
  }

  @HostListener('mouseup', ['$event']) mouseUp(event) {
    this.mouse.releasedOn(undefined, event);
  }

  @HostListener('mousemove', ['$event']) mouseMove(event) {
    this.mouse.moved(event);
  }

}
