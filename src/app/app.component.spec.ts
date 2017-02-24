/* tslint:disable:no-unused-variable */

import { Router } from '@angular/router';

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';

import { ConceptMapModule } from './conceptmap/conceptmap.module';

import { ButtonModule, MenubarModule, DialogModule } from 'primeng/primeng';

describe('Test AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        ButtonModule,
        MenubarModule,
        DialogModule,

        ConceptMapModule
      ],
      providers: [
        { provide: Router, useClass: undefined }
      ]
    });

    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create the app', async(() => {
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should show help message`, async(() => {
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div.help-text').textContent).toContain('Double click to create a concept');
  }));

  it(`Help message should disappear after a double click`, async(() => {
    let compiled = fixture.debugElement.nativeElement;

    fixture.detectChanges();
    expect(compiled.querySelector('div.help-text').textContent).toContain('Double click to create a concept');

    fixture.debugElement.triggerEventHandler('dblclick', {});
    fixture.detectChanges();
    expect(compiled.querySelector('div.help-text')).toBeNull;
  }));

});
