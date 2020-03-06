import React from 'react';
import logo from './logo.svg';
import './App.css';

import { FocusableList, FocusableItem, FocusContext } from './Focusable';

class App extends React.Component {

  render() {
    return (
      <FocusContext.Provider value={{ collectionId: null }}>
        <h1>App header</h1>
        <FocusableList isRow>
          <FocusableList>
            <h1>inner row 1</h1>
            <FocusableItem>
              <div>
                <p>one</p>
              </div>
            </FocusableItem>
            <FocusableItem>
              <div>
                <p>two</p>
              </div>
            </FocusableItem>
            <FocusableItem>
              <div>
                <p>three</p>
              </div>
            </FocusableItem>
          </FocusableList>
          <FocusableList>
            <h1>inner row 2</h1>
              <FocusableItem>
                <div>
                  <p>one</p>
                </div>
              </FocusableItem>
              <FocusableItem>
                <div>
                  <p>two</p>
                </div>
              </FocusableItem>
              <FocusableItem>
                <div>
                  <p>three</p>
                </div>
              </FocusableItem>
          </FocusableList>
        </FocusableList>
      </FocusContext.Provider>
    );
  }
}

export default App;
