import { CmapPage } from './app.po';

describe('cmap App', function() {
  let page: CmapPage;

  beforeEach(() => {
    page = new CmapPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
