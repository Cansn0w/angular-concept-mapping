import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ConceptMapComponent } from './conceptmap.component';
import { ConceptComponent } from './concept.component';
import { PropositionComponent } from './proposition.component';
import { MouseService  } from './mouse.service';
import { SelectionService  } from './selection.service';

/**
 * ConceptMap module
 */
@NgModule({
  declarations: [
    ConceptMapComponent,
    ConceptComponent,
    PropositionComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    ConceptMapComponent
  ],
  providers: [
    MouseService,
    SelectionService
  ]
})
export class ConceptMapModule {

}
