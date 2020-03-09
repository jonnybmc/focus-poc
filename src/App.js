import React from 'react';
import logo from './logo.svg';
import './App.css';

import { FocusableList, FocusableItem, FocusContext } from './Focusable';

class App extends React.Component {

  render() {
    return (
      <FocusContext.Provider value={{}}>
        <FocusableList name='root' isRow>
          <FocusableList name='list 1'>
            <FocusableItem withFocus>
              <p>focus item oen</p>
            </FocusableItem>
            <FocusableItem>
              <p>focus item two</p>
            </FocusableItem>
            <FocusableItem>
              <p>focus item three</p>
            </FocusableItem>
          </FocusableList>
          
          <FocusableList name='list 2'>
            <FocusableItem>
              <p>focus item oen</p>
            </FocusableItem>
            <FocusableItem>
              <p>focus item two</p>
            </FocusableItem>
            <FocusableItem>
              <p>focus item three</p>
            </FocusableItem>
        </FocusableList>
        </FocusableList>
      </FocusContext.Provider>
    );
  }
}

export default App;
