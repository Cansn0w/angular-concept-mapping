import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ConceptMapComponent } from './conceptmap.component';
import { ConceptComponent } from './concept.component';
import { PropositionComponent } from './proposition.component';
import { HandleComponent } from './handle.component';
import { MouseService  } from './mouse.service';
import { SelectionService  } from './selection.service';
import { ConceptMap } from './conceptmap.types';
import { ComponentManager } from './componentmanager.service';
import { ContenteditableDirective } from './contenteditable.directive';

/**
 * ConceptMap module
 */
@NgModule({
  declarations: [
    ConceptMapComponent,
    ConceptComponent,
    PropositionComponent,
    HandleComponent,
    ContenteditableDirective
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    ConceptMapComponent
  ],
  providers: [
    MouseService,
    SelectionService,
    ConceptMap,
    ComponentManager
  ]
})
export class ConceptMapModule {

}
