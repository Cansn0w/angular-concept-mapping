import { Component, HostListener, ViewChild } from '@angular/core';
import { ConceptMapComponent } from './ConceptMap/conceptmap.component';

import { ie } from './ConceptMap/etc';

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

  export() {
    if (ie) {
      window.navigator.msSaveBlob(new Blob([this.cmap.export()]), 'ConceptMap.json');
    } else {
      // Create a downloadable file through data URI
      // reference http://stackoverflow.com/a/18197341
      let a = document.createElement('a');
      a.style.display = 'none';
      a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.cmap.export()));
      a.setAttribute('download', 'ConceptMap.json');

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    this.cmap.export();
  }

  import(event) {
    let reader = new FileReader();
    reader.onloadend = (e) => {
      this.cmap.import(reader.result);
    };
    reader.readAsText(event.target.files[0]);
  }

  @HostListener('window:keydown', ['$event']) keyDown(event) {
    // DEL: delete
    if (event.key === 'Delete' || event.key === 'Del') {
      this.cmap.deleteSelected();
    } else
    // Ctrl-A: select all
    if (event.key.toUpperCase() === 'A' && event.ctrlKey && !event.shiftKey && !event.altKey) {
      this.cmap.selectAll();
      event.preventDefault();
    } else
    // Ctrl-S: export
    if (event.key.toUpperCase() === 'S' && event.ctrlKey && !event.shiftKey && !event.altKey) {
      this.export();
      event.preventDefault();
    }
  }

}
