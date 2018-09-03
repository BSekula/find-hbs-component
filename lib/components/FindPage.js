'use babel';

/** @jsx etch.dom */
import etch from 'etch';
import SelectList from 'atom-select-list';
import Header from './Header';
import List from './List';
import { emiter } from '../helpers/emiterService';
import { TextEditor } from 'atom';

export class FindPage {
  constructor(props, children) {
    this.searchResults = [];
    this.searchCount = 0;
    this.activeRow = 0;

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
        <TextEditor mini on={{ keyUp: this.onKeyUp }} />
        <ul>
          {this.searchResults.map(
            row => this.elementForItem(row),
          )}
        </ul>
      </div>
    );
  }


  elementForItem = item => (
    <li>
      <ul>
        <li className="file-path">{item.filePath}</li>
        {item.matches.map(match => <li>{match.lineText}</li>)}
      </ul>
    </li>
  )

  onKeyUp = (event) => {
    if (event.key === 'ArrowDown') {
      this.activeRow++;
      if (this.activeRow === this.searchResults.length) {
        this.activeRow = 0;
      }
    } else if (event.key === 'ArrowUp') {
      this.activeRow--;
      if (this.activeRow < 0) {
        this.activeRow = this.searchResults.length - 1;
      }
    }
    this.update();
  }

  focus = () => {
    this.refs.pageView.focus()
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
