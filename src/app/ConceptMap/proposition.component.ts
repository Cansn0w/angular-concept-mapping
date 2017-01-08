import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';

import { ElementComponent } from './element.component';
import { ConceptComponent } from './concept.component';
import { Proposition } from './conceptmap.types';

/**
 * Proposition component. Define the Proposition html element.
 * This element further contains an SVG path and a label.
 */
@Component({
  selector: 'cm-proposition',
  templateUrl: './proposition.component.html',
  styleUrls: ['./conceptmap.component.css']
})
export class PropositionComponent extends ElementComponent implements OnInit, OnDestroy {

  @Input() proposition: Proposition;

  @ViewChild('label') label: ElementRef;

  from: ConceptComponent;
  to: ConceptComponent;

  vector = {x: 0, y: 0};  // the vector represating the line to draw.
  diff = {x: 0, y: 0};  // the vector between the two concepts.

  ngOnInit() {
    this.manager.addPropositionComponent(this);
    this.from = this.manager.getConceptComponent(this.proposition.from);
    this.to = this.manager.getConceptComponent(this.proposition.to);

    // get focus on creation
    if (!this.proposition.text) { // todo - a better way to detect is needed.
      window.setTimeout(() => {
        this.selection.select(this);
        this.enableEdit();
      }, 0);
    }
  }

  ngOnDestroy() {
    this.manager.removePropositionComponent(this);
  }

  get x() {
    return (this.from.concept.x + this.to.concept.x) / 2;
  }

  get y() {
    return (this.from.concept.y + this.to.concept.y) / 2;
  }

  /**
   * Get the SVG Line path of the proposition
   * The end point of the line should fall on the edge of the 'to' concept component, therefore, line clipping is required here.
   */
  get linePath() {
    let vx = this.to.concept.x - this.from.concept.x;
    let vy = this.to.concept.y - this.from.concept.y;
    if (this.diff.x !== vx || this.diff.y !== vy) {
      this.diff.x = vx;
      this.diff.y = vy;
      let heightBound = this.to.height / 2;
      let widthBound = this.to.width / 2;

      /*
       * The two condition below indecates the direction of the 'from' concept at the 'to' concept
       * which is needed to decide which edge of the 'to' concept should be used for clipping.
       *
       * t1, t2 will be show values illustrated below.
       *             \  false, true /
       *              +------------+
       * false, false | to concept | true, true
       *              +------------+
       *             /  true, false \
       */
      let t1 = heightBound / widthBound * vx + vy > 0;  // true - on lower right region, false - on upper left region
      let t2 = heightBound / widthBound * vx - vy > 0;  // true - on upper right region, false - on lower left region

      let dx: number, dy: number;  // length to be clipped.

      if (t1) {
        if (t2) {
          // true, ture - clip with the right edge
          dx = -widthBound;
          dy = -widthBound * vy / vx;
        } else {
          // true, false - clip with the bottom edge
          dy = -heightBound;
          dx = -heightBound * vx / vy;
        }
      } else {
        if (t2) {
          // false, ture - clip with the top edge
          dy = heightBound;
          dx = heightBound * vx / vy;
        } else {
          // false, false - clip with the left edge
          dx = widthBound;
          dy = widthBound * vy / vx;
        }
      }

      this.vector.x = vx + dx;
      this.vector.y = vy + dy;
    }
    return [
      'M', this.from.concept.x + ',' + this.from.concept.y,
      'L', (this.from.concept.x + this.vector.x) + ',' + (this.from.concept.y + this.vector.y)
    ].join(' ');
  }

  enableEdit() {
    super.enableEdit();

    // todo - replace with more portable implemetation.
    window.setTimeout(() => {
      this.label.nativeElement.focus();
      let range = document.createRange();
      range.selectNodeContents(this.label.nativeElement);
      let sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }, 0);
  }

}
