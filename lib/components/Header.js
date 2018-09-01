'use babel';

/** @jsx etch.dom */
import etch from 'etch';

class Header {
  constructor(props, children) {
    this.searchCount = props.searchCount || 0;
    this.children = children;
    props.onCounterChange(this.update);
    etch.initialize(this);
  }

  update = (props) => {
    this.searchCount = props;
    return etch.update(this);
  }

  onCounterChange() {
    this.update();
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
