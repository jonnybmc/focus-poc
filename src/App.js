import React from 'react';
import { FocusableList, FocusableItem, FocusContext } from './Focusable';

class App extends React.Component {

  render() {
    return (
      <FocusContext.Provider value={{}}>
        <FocusableList name='list 2'>
          <div className='container'>
            <div className='row'>
              <div className='col-3'>
                <FocusableList isRow>
                  <FocusableItem withFocus>
                    <p>focus item one</p>
                  </FocusableItem>
                  <FocusableItem>
                    <p>focus item two</p>
                  </FocusableItem>
                  <FocusableItem>
                    <p>focus item three</p>
                  </FocusableItem>
                </FocusableList>
              </div>
              <div className='col-9'>
                
              <FocusableList isRow>
                <FocusableList>
                  <div className='row'>
                    <h2>row 1</h2>
                  </div>
                  <div className='row'>
                    <FocusableItem>
                      <p className='col-4'>focus item a</p>
                    </FocusableItem>
                    <FocusableItem>
                      <p className='col-4'>focus item b</p>
                    </FocusableItem>
                    <FocusableItem>
                      <p className='col-4'>focus item c</p>
                    </FocusableItem>
                  </div>
                </FocusableList>

                <FocusableList>
                  <div className='row'>
                    <h2>row 2</h2>
                  </div>
                  <div className='row'>
                    <FocusableItem>
                      <p className='col-4'>focus item a</p>
                    </FocusableItem>
                    <FocusableItem>
                      <p className='col-4'>focus item b</p>
                    </FocusableItem>
                    <FocusableItem>
                      <p className='col-4'>focus item c</p>
                    </FocusableItem>
                  </div>
                </FocusableList>        

              </FocusableList>
              </div>
            </div>
          </div>
        </FocusableList>
      </FocusContext.Provider>
    );
  }
}

export default App;
