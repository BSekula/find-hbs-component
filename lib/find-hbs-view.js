'use babel';

import { CompositeDisposable } from 'atom';
import { FindPage } from './components/FindPage';
import { emiter } from './helpers/emiterService';

export default class FindHbsView {
  constructor(serializedState) {
    this.page = new FindPage({ counter: 0 });
    this.rootElement = this.createRootElement(this.page);
    this.setSubscriptions(this.rootElement);

    this.editorElement = this.page.refs.textEditor.element;
    this.editorElement.focus();
    this.editorElement.addEventListener('blur', this.onLostFocus);
    emiter.on('did-search-finish', this.onLostFocus);
  }

  onLostFocus = () => {
    this.editorElement.focus();
  }

  setSubscriptions = (rootElement) => {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      atom.commands.add(rootElement, {
        'core:move-up': (event) => {
          console.log('move-up');
          event.stopPropagation();
        },
        'core:move-down': (event) => {
          console.log('move-down');
          event.stopPropagation();
        },
      }),
    );
  }

  createRootElement(pageView) {
    const rootElement = document.createElement('div');
    rootElement.classList.add('find-hbs');
    rootElement.appendChild(pageView.element);
    return rootElement;
  }

  updatePage(props) {
    this.page.emitFinishSearch(props);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  destroy() {
    this.rootElement.remove();
    this.subscriptions.dispose()
  }

  getElement() {
    return this.rootElement;
  }

  getTitle() {
    return 'HBS FIND';
  }

  getURI() {
    // Used by Atom to identify the view when toggling.
    return 'atom://find-hbs';
  }
}
