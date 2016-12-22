/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';

import { ConceptMapModule } from './ConceptMap/conceptmap.module';

describe('TestAppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        ConceptMapModule
      ],
    });

    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create the app', async(() => {
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have a line of help message`, async(() => {
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div').textContent).toContain('Double click to create a concept');
  }));

  it(`Help message should disappear after a double click`, async(() => {
    let compiled = fixture.debugElement.nativeElement;

    fixture.detectChanges();
    expect(compiled.querySelector('div').textContent).toContain('Double click to create a concept');

    fixture.debugElement.triggerEventHandler('dblclick', {});
    fixture.detectChanges();
    expect(compiled.querySelector('div')).toBeNull;
  }));

});
