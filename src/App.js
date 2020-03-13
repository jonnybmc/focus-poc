import React from 'react';
import { FocusableList, FocusableItem, FocusContext } from './Focusable';

class App extends React.Component {
  render() {
    return (
      <FocusContext.Provider value={{}}>
        <div className='container'>
            <div className='row'>
              <FocusableList isGrid>
                  {renderGridItems(150, true)}
              </FocusableList>
            </div>
          </div>
      </FocusContext.Provider>
    );
    // return (
    //   <FocusContext.Provider value={{}}>
    //     <FocusableList name='list 2'>
    //       <div className='container'>
    //         <div className='row'>
    //           <div className='col-3'>
    //             <FocusableList isRow stateful>
    //               <FocusableItem withFocus>
    //                 <p>focus item one</p>
    //               </FocusableItem>
    //               <FocusableItem>
    //                 <p>focus item two</p>
    //               </FocusableItem>
    //               <FocusableItem>
    //                 <p>focus item three</p>
    //               </FocusableItem>
    //             </FocusableList>
    //           </div>
    //           <div className='col-9'>
                
    //           <FocusableList isRow>
    //             {renderRows(10)}
    //           </FocusableList>
    //           </div>
    //         </div>
    //       </div>
    //     </FocusableList>
    //   </FocusContext.Provider>
    // );
  }
}

function renderRows(n) {
  const ret = [];
  let i = 1;
  while (i <= n) {
    ret.push(renderContentRow(i++));
  }
  return ret;
}

function renderGridItems(n, focusFirst) {
  let i = 0;
  const ret = [];
  while (i <= n) {
    ret.push(
      <FocusableItem key={i} withFocus={focusFirst ? i === 0 : false}>
        <p className='col-3'>focus item {i++}</p>
      </FocusableItem>
    )
  }
  return ret;
}

function renderContentRow(rowNum) {
  return (
    <FocusableList key={rowNum}>
      <div className='row'>
        <h2>row {rowNum}</h2>
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
  );
}

export default App;
