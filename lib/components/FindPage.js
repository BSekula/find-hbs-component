'use babel';

/** @jsx etch.dom */
import etch from 'etch';
import Header from './Header';
import List from './List';
import { emiter } from '../helpers/emiterService';

export class FindPage {
  constructor(props, children) {
    this.counter = props.counter;

    etch.initialize(this);
  }

  // Required: The `render` method returns a virtual DOM tree representing the
  // current state of the component. Etch will call `render` to build and update
  // the component's associated DOM element. Babel is instructed to call the
  // `etch.dom` helper in compiled JSX expressions by the `@jsx` pragma above.
  render() {
    return (
      <div>
        <Header>
          <button on={{ click: this.closeView }}>Click Me!!</button>
        </Header>
        <List />
      </div>
    );
  }

  onButtonClick = () => {
    emiter.emit('did-update-counter', ++this.counter);
  }

  closeView = () => {
    emiter.emit('did-close-view');
  }

  update = (props, children) => {
    emiter.emit('did-update-counter', props.searchCount);
    emiter.emit('did-finish-search', props.searchResults);
    return etch.update(this);
  }

  // Optional: Destroy the component. Async/await syntax is pretty but optional.
  async destroy() {
    // call etch.destroy to remove the element and destroy child components
    await etch.destroy(this);
    // then perform custom teardown logic here...
  }
}
