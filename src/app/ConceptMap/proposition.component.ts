import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';

import { ElementComponent } from './element.component';
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
export class PropositionComponent extends ElementComponent implements OnInit {

  @Input() proposition: Proposition;

  @ViewChild('label') label: ElementRef;

  ngOnInit() {
    if (!this.proposition.text) { // todo - a better way to detect is needed.
      window.setTimeout(() => {
        this.selection.select(this);
        this.enableEdit();
      }, 0);
    }
  }

  x() {
    return (this.proposition.from.x + this.proposition.to.x) / 2;
  }

  y() {
    return (this.proposition.from.y + this.proposition.to.y) / 2;
  }

  linePath() {
    return [
      'M', this.proposition.from.x + ',' + this.proposition.from.y,
      'L', this.proposition.to.x + ',' + this.proposition.to.y
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
