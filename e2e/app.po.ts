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
  ];

  navigateTo() {
    return browser.get('/');
  }

  doubleClick(point: Point) {
    browser.actions().mouseMove(point).doubleClick().mouseMove(point.opposite()).perform();
  }

  click(point: Point) {
    browser.actions().mouseMove(point).click().mouseMove(point.opposite()).perform();
  }

  drag(from: Point, to: Point) {
    const movement = new Point(to.x - from.x, to.y - from.y);
    browser.actions()
    .mouseMove(from).mouseDown().mouseMove(movement).mouseUp()
    .mouseMove(movement.opposite()).mouseMove(from.opposite()).perform();
  }

  getHandle(point: Point) {
    return new Point(point.x, point.y - 25);
  }

  getHelpText() {
    return element(by.xpath('//cm-root/div'));
  }

}
