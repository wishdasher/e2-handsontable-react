import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './handsontable.css'

import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';

// Mocking a shared global state
var custom = 20;

// Custom editor to add hook to keyboard events
class CustomEditor extends Handsontable.editors.TextEditor {
  constructor(props) {
    super(props);
  }

  onBeforeKeyDown = (event) => {
    if (event.which === 38) {
      event.stopImmediatePropagation();
      custom++;
    }
    if (event.which === 40) {
      event.stopImmediatePropagation();
      custom--;
    }
  }

  open() {
    this.instance.addHook('beforeKeyDown', this.onBeforeKeyDown);
  }

  close() {
    this.instance.removeHook('beforeKeyDown', this.onBeforeKeyDown);
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    // Trying to make things dependent
    let dep = "uservalue";

    this.settings1 = {
      data: [
      ["Name", "Id", "Age", "custom value"],
      ["Alice", 11, custom, 13],
      ["Bob", 12, 13, 13],
      ["Carol", 13, 12, 13]
    ],
    columns: [
      {}, {}, {
        editor: CustomEditor,
        renderer: function(instance, td, row, col, prop, value, cellProperties){
          if (row === 1) {
            td.innerHTML = custom;
          } else {
            td.innerHTML = value;
          }
          return td;
        }
      },
      {
        validator: function(value, callback) {
          dep = value;
          callback(true);
        },
        renderer: function(instance, td, row, col, prop, value, cellProperties){
          if (row !== 0) {
            td.innerHTML = dep + " for row "+ row;
          } else {
            td.innerHTML = value;
          }
          return td;
        }
      },
      ],
      colHeaders: true,
      rowHeaders: true,
      stretchH: "all",
    };

    this.settings2 = {
      data: [
      ["Name", "Scores", "custom value"],
      ["Alice", "10, 20, 30", 20],
      ["Bob", "20, 30, 40", 30],
      ["Charlie", "15, 15, 15", 15],
      ["Daniel", "24, 24, 24", 24],
    ],
    columns: [
      {},
      {
        renderer: function(instance, td, row, col, prop, value, cellProperties){
            if (row !== 0) {
              td.className = "custom-td";
              td.innerHTML = "";
              const scores = value.split(",");
              for (let i = 0; i < scores.length; i++) {
                // Read-only display of data...
                const div = document.createElement("div");
                div.className += " custom-list";
                div.innerHTML = scores[i];
                td.appendChild(div);
              }
          } else {
            td.innerHTML = value;
          }
          return td;
        }
      },
      {
        renderer: function(instance, td, row, col, prop, value, cellProperties){
            if (row !== 0) {
              // doesn't update
              td.innerHTML = dep + " for row "+ row;
            } else {
              td.innerHTML = value;
            }
            return td;
        }
      },
    ],
      colHeaders: true,
      rowHeaders: true,
      stretchH: "all",
    };
  }

  render() {

    // dependency from one to another
    // concerns: multiple values in cell, certain ways to influence styling

    return (
      <React.Fragment>
        <div id="table1">
          <HotTable settings={this.settings1} />
        </div>
        <div id="table2">
          <HotTable settings={this.settings2} />
        </div>
      </React.Fragment>

    );

  }
}

export default App;
