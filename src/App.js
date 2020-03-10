import React from 'react';
import './App.css';

import { FocusableList, FocusableItem, FocusContext } from './Focusable';

class App extends React.Component {

  render() {
    return (
      <FocusContext.Provider value={{}}>
        <FocusableList name='list 2' isRow>
          <FocusableItem withFocus>
            <p>focus item oen</p>
          </FocusableItem>
          <FocusableItem>
            <p>focus item two</p>
          </FocusableItem>
          <FocusableItem>
            <p>focus item three</p>
          </FocusableItem>

          <FocusableList isRow>
            <FocusableItem>
              <p>focus item a</p>
            </FocusableItem>
            <FocusableItem>
              <p>focus item b</p>
            </FocusableItem>
            <FocusableItem>
              <p>focus item c</p>
            </FocusableItem>
          </FocusableList>
        </FocusableList>
      </FocusContext.Provider>
    );
  }
}

export default App;
