import { Component, Input, HostBinding } from '@angular/core';

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
export class PropositionComponent {
  @Input() proposition: Proposition;

  positionX() {
    return (this.proposition.from.x + this.proposition.to.x) / 2;
  }

  positionY() {
    return (this.proposition.from.y + this.proposition.to.y) / 2;
  }

  linePath() {
    return ['M', this.proposition.from.x + ',' + this.proposition.from.y, 'L', this.proposition.to.x + ',' + this.proposition.to.y].join(' ')
  }
}
