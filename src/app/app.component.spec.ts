/* tslint:disable:no-unused-variable */

import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';

import { ConceptMapModule } from './conceptmap/conceptmap.module';

import { ButtonModule, MenubarModule, DialogModule } from 'primeng/primeng';

const TEST_MAP = '{"concepts":[{"text":"test","x":156,"y":116,"id":"f809d7b2"}],"propositions":[]}';

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
        RouterTestingModule,
        NoopAnimationsModule,

        ConceptMapModule
      ],
      providers: []
    });

    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create the app', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should show help message`, async(() => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div.help-text').textContent).toContain('Double click to create a concept');
  }));

  it(`Help message should disappear after a double click`, async(() => {
    const compiled = fixture.debugElement.nativeElement;

    fixture.detectChanges();
    expect(compiled.querySelector('div.help-text').textContent).toContain('Double click to create a concept');

    fixture.componentInstance.cmap.import(TEST_MAP);
    fixture.detectChanges();
    expect(compiled.querySelector('div.help-text')).toBeNull();
  }));

});
