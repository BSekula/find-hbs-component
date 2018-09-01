'use babel';

import { FindPage } from './components/FindPage';

export default class FindHbsView {
  constructor(serializedState, toggleView) {
    this.toggleView = toggleView;
    this.rootElement = this.createRootElement();
    this.page = new FindPage({ counter: 0 });
    this.rootElement.appendChild(this.page.element);
  }

  createRootElement() {
    const rootElement = document.createElement('div');
    rootElement.classList.add('find-hbs');
    return rootElement;
  }

  updatePage(props) {
    this.page.update(props);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  destroy() {
    this.rootElement.remove();
  }

  getElement() {
    return this.rootElement;
  }

  getTitle() {
    return 'Active Editor Info';
  }

  getURI() {
    // Used by Atom to identify the view when toggling.
    return 'atom://find-hbs';
  }
}
