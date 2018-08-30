'use babel';

import FindHbsView from './find-hbs-view';
import { CompositeDisposable } from 'atom';
import path from 'path';

export default {

  findHbsView: null,
  modalPanel: null,
  subscriptions: null,

  searchResults: [],

  activate(state) {
    // this.findHbsView = new FindHbsView(state.findHbsViewState);
    // this.modalPanel = atom.workspace.addModalPanel({
    //   item: this.findHbsView.getElement(),
    //   visible: false
    // });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable(
      atom.workspace.addOpener(uri => {
        if (uri === 'atom://find-hbs') {
          return new FindHbsView();
        }
      }),
    );

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'find-hbs:toggle': () => this.toggle()
    }));

    this.onSearchFinished = this.onSearchFinished.bind(this);
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
    debugger;
  },

  toggle() {
     //atom.workspace.toggle('atom://find-hbs');
     // atom.workspace.scan(/Hello World/g, { paths: ['/']}, (search) => {
     //   debugger;
     // });
     this.searchResults = [];

     const searchingFile = this.getSearchedFile();

     if(typeof searchingFile === "undefined") {
       return;
     }

     atom.workspace.scan(
       searchingFile,
       {
         paths: ['templates'],
         onPathsSearched: this.onSearchFinished
       },
       (searchResult) => {
         this.searchResults.push(searchResult);
       }
     );

    // const editor = atom.workspace.getActivePaneItem();
    // const a = atom.workspace.getActiveTextEditor();
    // console.log(a.scan());
    // const name = editor.buffer.file.path.split("/").pop();
    // let searchName =  name.substring(0, name.indexOf('.'));
    //
    // console.log(searchName);
    // return (
    //   this.modalPanel.isVisible() ?
    //   this.modalPanel.hide() :
    //   this.modalPanel.show()
    // );
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
  }

};
