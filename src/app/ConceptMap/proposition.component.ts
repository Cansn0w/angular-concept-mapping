import { Component, Input, HostListener, ViewChild, ElementRef } from '@angular/core';

import { Proposition } from './conceptmap.types';
import { Task, MouseService  } from './mouse.service';
import { SelectionService, Selectable } from './selection.service';

/**
 * Proposition component. Define the Proposition html element.
 * This element further contains an SVG path and a label.
 */
@Component({
	selector: 'cm-proposition',
  templateUrl: './proposition.component.html',
  styleUrls: ['./conceptmap.component.css']
})
export class PropositionComponent implements Selectable {

  @Input() proposition: Proposition;

  @ViewChild('label') label: ElementRef;

  selected: boolean = false;
  selectable: string = "none";
  editable: boolean = false;

  constructor(
    private mouse: MouseService,
    private selection: SelectionService
  ) { }

  ngOnInit() {
    if(!this.proposition.text) { // todo - a better way to detect is needed.
      window.setTimeout(()=>{
        this.selection.clear();
        this.selection.add(this);
        this.enableEdit();
      }, 0)
    }
  }

  positionX() {
    return (this.proposition.from.x + this.proposition.to.x) / 2;
  }

  positionY() {
    return (this.proposition.from.y + this.proposition.to.y) / 2;
  }

  linePath() {
    return ['M', this.proposition.from.x + ',' + this.proposition.from.y, 'L', this.proposition.to.x + ',' + this.proposition.to.y].join(' ')
  }

  select(): void {
    this.selected = true;
  }

  deselect(): void {
    this.selected = false;
    if (this.editable) {
      this.disableEdit();
    }
  }

  isSelected(): boolean {
    return this.selected;
  }

  enableEdit() {
    this.selectable = "text";
    this.editable = true;
    window.setTimeout(()=>{
      this.label.nativeElement.focus();
      var range = document.createRange();
      range.selectNodeContents(this.label.nativeElement);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }, 0)
  }

  disableEdit() {
    this.editable = false;
    this.selectable = "none";
  }

  doubleClick(event) {
    event.stopPropagation();
    // when not selecting
    if (!event.ctrlKey && !event.shiftKey) {
      if (!this.editable) {
        this.enableEdit();
      }
    }
  }

  mouseDown(event) {
    this.mouse.pressedOn(this.proposition, event);
    // todo - refactor this.
    if (event.which === 1) {
      // disable drag while been editable
      if (!this.editable) {
        if (event.ctrlKey || event.shiftKey) {
          if (this.selected) {
            new Task(this.mouse, "mouseup", (event, unregister) => {
              if (event.which === 1) {
                if (!this.mouse.hasDragged(1)) {
                  this.selection.remove(this);
                }
                unregister();
              }
            })
          } else {
            this.selection.add(this);
          }
        } else {
          if (this.selected) {
            new Task(this.mouse, "mouseup", (event, unregister) => {
              if (event.which === 1) {
                if (!this.mouse.hasDragged(1)) {
                  this.selection.clear();
                  this.selection.add(this);
                }
                unregister();
              }
            })
          } else {
            this.selection.clear();
            this.selection.add(this);
          }
        }

        let dragTask = new Task(this.mouse, "mousemove", (event, unregister)=> {
          this.selection.apply((element)=> {
            if (element.concept) {
              element.concept.x += event.movementX;
              element.concept.y += event.movementY;
            }
          })
        })

        new Task(this.mouse, "mouseup", (event, unregister)=> {
          if (event.which === 1)  {
            dragTask.unRegister();
            unregister();
          }
        })
      }
    }
    event.stopPropagation();
  }

}
