'use babel';

/** @jsx etch.dom */
import etch from 'etch';
import Header from './Header';
import List from './List';
import { emiter } from '../helpers/emiterService';

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
  render() {
    return (
      <div
        ref="pageView"
        on={{ keyup: this.onKeyUp, click: this.focus }}
      >
        <button on={{ click: this.update }}>Update</button>
        <Header searchCount={this.searchCount}>
          <button on={{ click: this.closeView }}>Click Me!!</button>
        </Header>
        <List
          activeRow={this.activeRow}
          data={this.searchResults}
        />
      </div>
    );
  }

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

  // onButtonClick = () => {
  //   emiter.emit('did-update-counter', ++this.counter);
  // }

  closeView = () => {
    emiter.emit('did-close-view');
  }

  onSearchFinished = (searchData) => {
    this.searchCount = searchData.searchCount;
    this.searchResults = searchData.searchResults;
    this.update();
    // emiter.emit('did-update-counter', props.searchCount);
    // emiter.emit('did-finish-search', props.searchResults);
  }

  update = (props, children) => etch.update(this)

  // Optional: Destroy the component. Async/await syntax is pretty but optional.
  async destroy() {
    // call etch.destroy to remove the element and destroy child components
    await etch.destroy(this);
    // then perform custom teardown logic here...
  }
}
