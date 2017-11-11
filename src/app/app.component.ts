import { Component, HostListener, ViewChild, DoCheck } from '@angular/core';
import { ConceptMapComponent } from './conceptmap/conceptmap.component';

import { MenuItem } from 'primeng/primeng';

import { ie, keyMatch } from './conceptmap/etc';

@Component({
  selector: 'cm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck {
  @ViewChild(ConceptMapComponent) cmap: ConceptMapComponent;

  menu: MenuItem[] = [
      {
        label: 'File',
        items: [
          {
            label: 'Import (Ctrl+O)',
            command: () => this.importTool.visible = true
          },
          {
            label: 'Export (Ctrl+S)',
            command: () => this.export()
          }
        ]
      },
      {
        label: 'Edit',
        items: [
          {
            label: 'Select All (Ctrl+A)',
            command: () => this.cmap.selectAll()
          },
          {
            label: 'Delete (Delete)',
            command: () => this.cmap.deleteSelected()
          }
        ]
      }
    ];

  importTool = {
    _file: undefined,
    visible: false,
    chooseFile: (event) => {
      if (event.target.files[0]) {
        const reader = new FileReader();
        reader.onloadend = (e) => {
          this.importTool._file = reader.result;
        };
        reader.readAsText(event.target.files[0]);
      } else {
        this.importTool._file = undefined;
      }
    },
    loadFile: () => {
      try {
        this.cmap.import(this.importTool._file);
        this.importTool.visible = false;
        this.importTool._file = undefined;
      } catch (err) {
        // catch error
      }
    },
    disabled: () => !this.importTool._file
  };

  get isEmpty() {
    return this.cmap.cmap.concepts.size === 0;
  }

  ngDoCheck() {
    // todo - casting below is posibly a bug introduced in primeNG 5
    // todo - refactor this whole method.
    (<MenuItem> this.menu[0].items[1]).disabled = this.isEmpty;
    (<MenuItem> this.menu[1].items[0]).disabled = this.isEmpty;
    (<MenuItem> this.menu[1].items[1]).disabled = this.cmap.selection.selectedConceptComponent.size === 0 &&
    this.cmap.selection.selectedPropositionComponent.size === 0;
  }

  export() {
    if (ie) {
      window.navigator.msSaveBlob(new Blob([this.cmap.export()]), 'ConceptMap.json');
    } else {
      // Create a downloadable file through data URI
      // reference http://stackoverflow.com/a/18197341
      const a = document.createElement('a');
      a.style.display = 'none';
      a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.cmap.export()));
      a.setAttribute('download', 'ConceptMap.json');

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    this.cmap.export();
  }

  @HostListener('window:keydown', ['$event']) keyDown(event) {
    // DEL: delete
    if (event.key === 'Delete' || event.key === 'Del' || event.which === 46) {
      this.cmap.deleteSelected();
    } else
    // Ctrl-A: select all
    if (keyMatch(event, 'A', {ctrl: true})) {
      this.cmap.selectAll();
      event.preventDefault();
    } else
    // Ctrl-S: export
    if (keyMatch(event, 'S', {ctrl: true})) {
      this.export();
      event.preventDefault();
    }
    // Ctrl-O: open
    if (keyMatch(event, 'O', {ctrl: true})) {
      this.importTool.visible = true;
      event.preventDefault();
    }
  }

}
