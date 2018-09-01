'use babel';

/** @jsx etch.dom */
import etch from 'etch';
import { Emitter } from 'atom';
import Header from './Header';

export class FindPage {
  constructor(props, children) {
    this.counter = props.counter;
    this.emitter = new Emitter();

    etch.initialize(this);
  }

  // Required: The `render` method returns a virtual DOM tree representing the
  // current state of the component. Etch will call `render` to build and update
  // the component's associated DOM element. Babel is instructed to call the
  // `etch.dom` helper in compiled JSX expressions by the `@jsx` pragma above.
  render() {
    return (
      <div>
        <button on={{ click: this.onButtonClick }}>Click Me!!</button>
        <Header searchCount={this.counter} onCounterChange={this.onCounter}>
          <button on={{ click: this.onButtonClick }}>Click Me!!</button>
        </Header>
      </div>
    );
  }

  onCounter = callback => this.emitter.on('did-update-counter', callback)

  onButtonClick = () => {
    this.emitter.emit('did-update-counter', ++this.counter);
  }

  // Required: Update the component with new properties and children.
  update(props, children) {
    // perform custom update logic here...
    // then call `etch.update`, which is async and returns a promise
    return etch.update(this);
  }

  // Optional: Destroy the component. Async/await syntax is pretty but optional.
  async destroy() {
    // call etch.destroy to remove the element and destroy child components
    await etch.destroy(this);
    // then perform custom teardown logic here...
  }
}
