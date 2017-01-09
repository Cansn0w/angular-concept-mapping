import { Component, ViewChild } from '@angular/core';
import { ConceptMapComponent } from './ConceptMap/conceptmap.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(ConceptMapComponent) cmap: ConceptMapComponent;

  get helpText() {
    return this.cmap.cmap.concepts.length === 0;
  }

}
