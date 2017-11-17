import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Store from './store/store';
import { counter } from './reducers/counter';
import { random } from './reducers/random';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

console.log("Create Store")
const myStore = Store.createStore(counter).addReducer(random);

//Can't access state
console.log("Error - trying to directly access state:", myStore._state)
//Can access the state
console.log("Correct - accessing state via getState():", myStore.getState())

ReactDOM.render(<MuiThemeProvider>
                  <App store={myStore} />
                </MuiThemeProvider>, 
                document.getElementById('app'))