'use babel';

/** @jsx etch.dom */
import etch from 'etch';
import { emiter } from '../helpers/emiterService';

class Header {
  constructor(props, children) {
    this.setProperties(props, children);
    emiter.on('did-update-counter', this.update);
    etch.initialize(this);
  }

  update = (props, children) => {
    this.setProperties(props, children);
    return etch.update(this);
  }

  setProperties = (props, children) => {
    this.searchCount = Number.isInteger(props)
      ? props
      : props.searchCount || 0;

    this.children = children || this.children;
  }

  render() {
    return (
      <div>
        <h2>Search count: {this.searchCount}</h2>
        {this.children}
      </div>
    );
  }
}

export default Header;
