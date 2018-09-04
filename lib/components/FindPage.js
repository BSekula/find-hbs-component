'use babel';

/** @jsx etch.dom */
import etch from 'etch';
import SelectList from 'atom-select-list';
import { TextEditor, CompositeDisposable } from 'atom';
import Header from './Header';
import List from './List';
import { emiter } from '../helpers/emiterService';

export class FindPage {
  constructor(props, children) {
    this.searchResults = [];
    this.searchCount = 0;
    this.activeRow = 0;
    this.activeSearchRow = 0;

    emiter.on('did-search-finish', this.onSearchFinished);

    etch.initialize(this);
  }

  // Required: The `render` method returns a virtual DOM tree representing the
  // current state of the component. Etch will call `render` to build and update
  // the component's associated DOM element. Babel is instructed to call the
  // `etch.dom` helper in compiled JSX expressions by the `@jsx` pragma above.
  /* <List
    activeRow={this.activeRow}
    data={this.searchResults}
  />
  <SelectList
    items={this.searchResults}
    elementForItem={this.elementForItem}
  />
  */
  render() {
    return (
      <div>
        <Header searchCount={this.searchCount}>
          <button on={{ click: this.closeView }}>Close</button>
        </Header>
        <TextEditor mini ref="textEditor" />
        <ul>
          {this.searchResults.map(
            (row, index) => this.elementForItem(row, index),
          )}
        </ul>
      </div>
    );
  }

  elementForItem = (item, index) => (
    <li>
      <ul className={this.activeRow === index ? 'active file-path' : 'no-active file-path'}>
        <li>
          {item.filePath}
        </li>
        {item.matches.map((match, searchIndex) =>
          <li on={{ click: this.openFile }}
            className={ this.activeRow === index && this.activeSearchRow === searchIndex ? 'active-search-row' : 'no-active-search-row'}>
            { match.lineText }
          </li>)
        }
      </ul>
    </li>
  )

  openFile = () => {
    atom.workspace.open(
      this.searchResults[this.activeRow].filePath,
      {
        initialLine: this.searchResults[this.activeRow].matches[this.activeSearchRow].range[0][0],
        initialColumn: this.searchResults[this.activeRow].matches[this.activeSearchRow].range[0][1],
      }
    );
  }

  onKeyUp = (event) => {
    let activeRow = this.activeRow;
    let activeSearchRow = this.activeSearchRow;

    const canSwitchToNextRow = this.canSwitchToNextRow(activeRow, activeSearchRow, event);
    if (canSwitchToNextRow) {
      if (event.type === 'core:move-down') {
        if (activeRow + 1 === this.searchResults.length) {
          activeRow = 0;
        } else {
          activeRow++;
        }
        activeSearchRow = 0;
      } else if (event.type === 'core:move-up') {
        if (activeRow - 1 < 0) {
          activeRow = this.searchResults.length - 1;
          activeSearchRow = 0;
        } else {
          activeRow--;
        }
        activeSearchRow = 0;
      }
    } else {
      if (event.type === 'core:move-down') {
        activeSearchRow++;
      } else {
        activeSearchRow--;
      }
    }
    this.activeRow = activeRow;
    this.activeSearchRow = activeSearchRow;

    this.update();
  }

  canSwitchToNextRow = (activeRow, activeSearchRow, event) => {
    const searchCountForRow = this.searchResults[activeRow].matches.length;
    if (event.type === 'core:move-down') {
      if (activeSearchRow + 1 >= searchCountForRow) {
        return true;
      }

      return false;
    }
    if (event.type === 'core:move-up') {
      if (activeSearchRow - 1 < 0) {
        return true;
      }

      return false;
    }
  }

  closeView = () => {
    emiter.emit('did-close-view');
  }

  onSearchFinished = (searchData) => {
    this.searchCount = searchData.searchCount;
    this.searchResults = searchData.searchResults;
    this.update();
  }

  update = (props, children) => etch.update(this)

  async destroy() {
    await etch.destroy(this);
  }
}
