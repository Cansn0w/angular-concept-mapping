import { Component, Input, HostListener, HostBinding } from '@angular/core';

import { Concept, ConceptMap, Proposition } from './conceptmap.types';
import { Task, MouseService  } from './mouse.service';

/**
 * Handle component. used to create propositions.
 * This component is draggable so the user can create propositions by dragging from a concept to another.
 */
@Component({
  selector: 'cm-handle',
  template: 'Link',
  styleUrls: ['./conceptmap.component.css']
})
export class HandleComponent {

  @Input() from: Concept;

  @HostBinding("style.left.px") x: number;
  @HostBinding("style.top.px") y: number;

  constructor(
    private mouse: MouseService,
    private cmap: ConceptMap
    ) { }

  createProposition(from: Concept, to: Concept) {
    // Check if there is already a proposition
    for (let i of this.cmap.propositions) {
      if (i.from === from && i.to === to || i.from === to && i.to === from) {
        return;
      }
    }
    this.cmap.propositions.push(new Proposition('', from, to))  // todo - replace stub
  }

  lastFrom: Concept = new Concept(undefined, undefined, undefined);
  ngDoCheck() {
    if (this.lastFrom.x != this.from.x || this.lastFrom.y != this.from.y) {
      this.lastFrom = new Concept(this.from.text, this.from.x, this.from.y);
      this.x = this.from.x;
      this.y = this.from.y - 32;
    }
  }

  @HostListener('mousedown', ['$event']) mouseDown(event) {
    this.mouse.pressedOn(this, event);
    if (event.which === 1) {
      let dragTask = new Task(this.mouse, "mousemove", (event, unregister) => {
        this.x += event.movementX;
        this.y += event.movementY;
      })
      new Task(this.mouse, "mouseup", (event, unregister)=> {
        if (event.which === 1)  {
          setTimeout(()=> {
            // todo - replace this error prone structure
            if (this.mouse.state[1].target && this.mouse.state[1].target.concept) {
              this.createProposition(this.from, this.mouse.state[1].target.concept)
            }
            this.x = this.from.x;
            this.y = this.from.y - 32;
            dragTask.unRegister();
            unregister();
          }, 0)
        }
      })
    }
    event.stopPropagation();
  }
}
