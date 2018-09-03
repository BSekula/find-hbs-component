'use babel';

/** @jsx etch.dom */
import etch from 'etch';

class List {
  constructor(props) {
    this.rows = props.data || [];
    this.activeRow = props.activeRow || 0;
    etch.initialize(this);
  }

  update = (props) => {
    this.rows = props.data || [];
    this.activeRow = props.activeRow || 0;
    return etch.update(this);
  }

  onRowClick = (e) => {
    debugger;
  }

  render() {
    return (
      <ul>
        TEST {this.rows}
        {this.rows.map(
          (row, index) => (
            <li
              on={{ click: this.onRowClick, keyup: this.onRowClick }}
              className={index === this.activeRow ? 'active' : 'none-active'}
            >
              <div>{row.filePath}</div>
              <div>Previev</div>
            </li>
          ),
        )}
      </ul>
    );
  }
}

export default List;
