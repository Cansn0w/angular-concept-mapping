import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonModule, MenubarModule, DialogModule } from 'primeng/primeng';

import { AppComponent } from './app.component';

import { ConceptMapModule } from './conceptmap/conceptmap.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    ButtonModule,
    MenubarModule,
    DialogModule,

    ConceptMapModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
