import { Point, ConceptMapPage } from './app.po';

import { browser, element, by, Key } from 'protractor';


describe('ConceptMap App', function() {

  const page = new ConceptMapPage();

  it('should display a help message', () => {
    page.navigateTo();
    expect(page.getHelpText().isPresent()).toBeTruthy();
    expect(page.getHelpText().getText()).toContain('Double click to create a concept');
  });

  it('should dismiss the help message after a double click', () => {
    page.doubleClick(page.points[0]);
    expect(page.getHelpText().isPresent()).toBeFalsy();
  });

  it('should create concepts on double click', () => {
    expect(element.all(by.css('cm-concept')).count()).toEqual(1);
  });

  it('should set newly created concept as selected', () => {
    expect(element(by.css('cm-concept')).getAttribute('class')).toContain('selected');
  });

  it('newly created conocept should accept input', () => {
    const testString = 'cmap e2e testing :-)';
    browser.actions().sendKeys(testString).perform();
    expect(element(by.css('cm-concept')).getText()).toEqual(testString);
  });

  it('selected is remove when clicked elsewhere', () => {
    expect(element(by.css('cm-concept')).getAttribute('class')).toContain('selected');
    browser.actions().mouseMove(page.points[1]).click().mouseMove(page.points[1].opposite()).perform();
    expect(element(by.css('cm-concept')).getAttribute('class')).not.toContain('selected');
  });

  it('ctrl-a will select the concept', () => {
    browser.actions().keyDown(Key.CONTROL).sendKeys('a').keyUp(Key.CONTROL).perform();
    expect(element(by.css('cm-concept')).getAttribute('class')).toContain('selected');
  });

  it('concept should move when dragged', () => {
    const newPos = new Point(page.points[0].x + 200, page.points[0].y + 200);

    page.drag(page.points[0], newPos);

    expect(element(by.css('cm-concept')).getCssValue('left')).toEqual(newPos.x + 'px');
    expect(element(by.css('cm-concept')).getCssValue('top')).toEqual(newPos.y + 'px');

    page.drag(newPos, page.points[0]);

    expect(element(by.css('cm-concept')).getCssValue('left')).toEqual(page.points[0].x + 'px');
    expect(element(by.css('cm-concept')).getCssValue('top')).toEqual(page.points[0].y + 'px');
  });

  it('del key should delete selected concepts', () => {
    expect(element(by.css('cm-concept')).isPresent()).toBeTruthy();
    browser.actions().mouseMove(page.points[0]).click().mouseMove(page.points[0].opposite()).sendKeys(Key.DELETE).perform();
    expect(element(by.css('cm-concept')).isPresent()).toBeFalsy();
  });

  it('can create multiple concepts', () => {

    expect(element.all(by.css('cm-concept')).count()).toEqual(0);

    let count = 1;
    for (const i of page.points) {
      page.doubleClick(i);
      browser.actions().sendKeys(String(count++)).perform();
    }

    expect(element.all(by.css('cm-concept')).count()).toEqual(page.points.length);

  });

  it('can select multiple concepts with control key pressed', () => {
    const point = new Point(60, 60);
    browser.actions().mouseMove(point).click().mouseMove(point.opposite()).perform();

    expect(element.all(by.css('cm-concept.selected')).count()).toEqual(0);

    browser.actions().keyDown(Key.CONTROL).perform();
    for (const p of page.points.slice(0, 4)) {
      page.click(p);
    }
    browser.actions().keyUp(Key.CONTROL).perform();

    expect(element.all(by.css('cm-concept.selected')).count()).toEqual(page.points.slice(0, 4).length);
  });

  it('delete key can delete multiple selected concepts', () => {
    expect(element.all(by.css('cm-concept')).count()).toEqual(page.points.length);
    browser.actions().sendKeys(Key.DELETE).perform();
    expect(element.all(by.css('cm-concept')).count()).toEqual(page.points.length - page.points.slice(0, 4).length);

    // get back the deleted concepts
    let count = 1;
    for (const i of page.points.slice(0, 4)) {
      page.doubleClick(i);
      browser.actions().sendKeys(String(count++)).perform();
    }
    expect(element.all(by.css('cm-concept')).count()).toEqual(page.points.length);
  });


  it('double click should enable editing', () => {
    const testString = 'test input :)';

    page.click(page.points[3]);

    expect(element(by.css('cm-concept.selected')).isPresent()).toBeTruthy();
    expect(element(by.css('cm-concept.selected')).getText()).toEqual('4');

    page.doubleClick(page.points[3]);
    browser.actions().sendKeys(testString).click().perform();

    page.click(page.points[3]);

    expect(element(by.css('cm-concept.selected')).getText()).toEqual(testString);
    expect(element.all(by.css('cm-concept')).count()).toEqual(page.points.length);  // and don't create new concepts
  });

  it('drag handle can create proposition', () => {
    page.click(page.points[0]);
    page.drag(page.getHandle(page.points[0]), page.points[1]);
    expect(element.all(by.css('cm-proposition')).count()).toEqual(1);
  });

  it('newly created proposition should accept input', () => {
    const testString = 'testing :-)';
    page.click(page.points[0]);
    page.drag(page.getHandle(page.points[0]), page.points[2]);
    browser.actions().sendKeys(testString).perform();
    expect(element(by.css('div.cm-label.selected')).getText()).toEqual(testString);
  });

  it('should not allow proposition to repeat', () => {
    expect(element.all(by.css('cm-proposition')).count()).toEqual(2);
    page.click(page.points[0]);
    page.drag(page.getHandle(page.points[0]), page.points[1]);
    page.click(page.points[1]);
    page.drag(page.getHandle(page.points[1]), page.points[0]);
    expect(element.all(by.css('cm-proposition')).count()).toEqual(2);
  });

  it('deleting concept also deletes dependent propositions', () => {
    expect(element.all(by.css('cm-proposition')).count()).toEqual(2);
    page.click(page.points[0]);
    browser.actions().sendKeys(Key.DELETE).perform();
    expect(element.all(by.css('cm-proposition')).count()).toEqual(0);
  });

});
