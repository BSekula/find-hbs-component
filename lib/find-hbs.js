'use babel';

import { CompositeDisposable } from 'atom';
import FindHbsView from './find-hbs-view';

import { emiter } from './helpers/emiterService';

export default {
  subscriptions: null,
  searchResults: [],

  activate(state) {
    debugger;
    this.pageView = new FindHbsView(state.findHbsViewState);

    this.subscriptions = new CompositeDisposable();

    // Add an opener for our view.
    this.subscriptions.add(atom.workspace.addOpener((uri) => {
      if (uri === 'atom://find-hbs') {
        return this.pageView;
      }

      return undefined;
    }));

    this.subscriptions.add(
      atom.commands.add(this.pageView.rootElement, {
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

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'find-hbs:toggle': () => this.toggle(),
    }));

    this.onSearchFinished = this.onSearchFinished.bind(this);
    this.toggleView = this.toggleView.bind(this);

    emiter.on('did-close-view', this.toggleView);
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
    this.toggleView();

    emiter.emit('did-search-finish', {
      searchCount,
      searchResults: this.searchResults,
    });
  },

  toggleView() {
    atom.workspace.toggle('atom://find-hbs');
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
