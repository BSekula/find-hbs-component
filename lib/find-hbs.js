'use babel';

import { CompositeDisposable } from 'atom';
import FindHbsView from './find-hbs-view';

export default {
  findHbsView: null,
  modalPanel: null,
  subscriptions: null,

  searchResults: [],

  activate(state) {
    this.findHbsView = new FindHbsView(state.findHbsViewState, this.toggleView);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.findHbsView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable(
      atom.workspace.addOpener((uri) => {
        if (uri === 'atom://find-hbs') {
          return new FindHbsView();
        }

        return null;
      }),
    );

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'find-hbs:toggle': () => this.toggle(),
    }));

    this.onSearchFinished = this.onSearchFinished.bind(this);
    this.toggleView = this.toggleView.bind(this);
  },

  deactivate() {
    // this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.findHbsView.destroy();
  },

  // serialize() {
  //   return {
  //     // findHbsViewState: this.findHbsView.serialize()
  //   };
  // },

  onSearchFinished(searchCount) {
    this.page.update({
      counter: searchCount,
      searchResults: this.searchResults,
    });

    this.toggleView();
  },

  toggleView() {
    return this.modalPanel.isVisible()
      ? this.modalPanel.hide()
      : this.modalPanel.show();
  },

  toggle() {
    this.searchResults = [];

    const searchingFile = this.getSearchedFile();

    if (typeof searchingFile === 'undefined') {
      return;
    }

    atom.workspace.scan(
      searchingFile,
      {
        paths: ['templates'],
        onPathsSearched: this.onSearchFinished,
      },
      (searchResult) => {
        this.searchResults.push(searchResult);
      },
    );
  },

  getSearchedFile() {
    const absolutePath = atom.workspace.getActivePaneItem().buffer.file.path;

    if (this.getFileExtension(absolutePath) !== 'hbs') {
      atom.notifications.addWarning('Not .hbs file!!');
      return;
    }

    const templateLastIndex = absolutePath.lastIndexOf('templates');

    // 10 - templates + /
    // -4 - remove .hbs
    const path = absolutePath.substring(templateLastIndex + 10, absolutePath.length - 4);
    const regex = new RegExp('\{\{.*' + path, 'gm');
    return regex;
  },

  getFileExtension(path) {
    const pathChunks = path.split('.');
    return pathChunks[pathChunks.length - 1];
  },

};
