import { browser, element, by } from 'protractor';

export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  opposite() {
    return new Point(-this.x, -this.y);
  }
}

export class ConceptMapPage {

  points = [
    new Point(160, 160),
    new Point(220, 280),
    new Point(340, 300),
    new Point(400, 180),
    new Point(180, 400),
    new Point(400, 400),
  ]

  navigateTo() {
    return browser.get('/');
  }

  doubleClick(point: Point) {
    browser.actions().mouseMove(point).doubleClick().mouseMove(point.opposite()).perform();
  }

  click(point: Point) {
    browser.actions().mouseMove(point).click().mouseMove(point.opposite()).perform();
  }

  getHelpText() {
    return element(by.xpath('//app-root/div'));
  }

}
