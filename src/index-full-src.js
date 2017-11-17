/* Full Source Code in Single File */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

//A helper function for checking if two objects have the same property values
const isEquivalent = (a, b) => {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length !== bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

/*=== STORE ===*/

//A Definition of a Store
class Store {
  // Dispatch Actions
  static ACTIONS = {
      Increment : 'INCREMENT',
      Decrement : 'DECREMENT',
      Random_10 : 'RANDOM_10',
      Random_100 : 'RANDOM_100'
  }

  // Function to create a new store using a reducer
  static createStore = (reducer) => {
    return new Store(reducer(undefined, {}), reducer)
  }

  constructor(initialState, reducer) {
    let _state = initialState,   //Make state private inside of Store
        _reducers = [reducer],   //Create array for holding reducers
        _listeners = []          //Array for holding listeners
          
    //Private method for accessing state. Note that this state is not the same as 
    //React state, but represents the current state of the store.
    let _getState = () => _state 
    
    //STEP 4: Dispatch is given the Increment Action
    //Dispatcher that calls reducer on action
    let _dispatch = (action) => {
      console.log(`Dispatch for ${action} received`)
      //STEP 5: Run the reducers with the Increment Action
      
      _reducers.forEach((reducer) => {
        //STEP 6: Reducer that handles Increment Action will return a newState
        let newState = reducer(_state, action) //Update the State
        if(!isEquivalent(newState, _state)) {  
          //STEP 10: update the state of the store with the newState
          console.log("store updating state")
          _state = newState
        }
      })
      
      //STEP 11: Notify each listener that the state has changed
      console.log("Store notifying listeners that state is changed")
      _listeners.forEach((listener)=> {
        //Invoke the callback provided by the listener
        //Pass the property the listener is tracking, and the current state
        listener.callback(_state[listener.property], _state)
      })

      //Return the new state of the store
      return _state
    }

    //Provide ability to provide other reducers
    this.addReducer = (reducer) => {
      Object.assign(_state, reducer(undefined, {}))
      _reducers.push(reducer)
      return this
    }

    //Privileged method providing Read-Only Access to state
    this.getState = () => _getState()

    //Privileged method to Dispatch actions on state
    this.dispatch = (action) => _dispatch(action)

    //Subscribe listener to be notified when _state is changed
    this.subscribe = (callback, property) => {
      _listeners.push({callback: callback, property: property})
      return this
    }
  }
}

/* === REDUCERS ===*/

// Counter Reducer: Increments or decrements a value
const counter = (state = { count: 0 }, action) => {
  console.log(`Running reducer 'counter' with action ${action}`)
  
  //STEP 7: counter reducer runs with action Increment
  let partialState = {}
  
  //STEP 8: create a state related to the Increment Action
  switch (action) {
    case Store.ACTIONS.Increment:
      partialState = { count: state.count + 1 }
      break
    case Store.ACTIONS.Decrement:
      partialState = { count: state.count - 1 }
      break
    default:
      console.log(`action ${action} not found in 'counter'. State not modified`)
      return state
  }
  
  console.log("counter: original state")
  console.log(state)

  console.log("counter: transformed state")
  console.log(Object.assign({}, state, partialState))
  
  //STEP 9: Return the new state with the updated count
  return Object.assign({}, state, partialState)
}

// Random Reducer: generates a random number either up to 10 or 100
const random = (state = { random: 0 }, action) => {
  console.log(`Running reducer 'random' with action ${action}`)
  let partialState = {}
  switch (action) {
    case Store.ACTIONS.Random_10:
      partialState = { random: Math.floor(Math.random() * 10) + 1  }
      break
    case Store.ACTIONS.Random_100:
      partialState = { random: Math.floor(Math.random() * 100) + 1  }
      break
    default:
      console.log(`action ${action} not found in 'random'. State not modified`)
      return state  
  }
  
  let newState = Object.assign({}, state, partialState)
  
  console.log("random: original state")
  console.log(state)
  
  console.log("random: transformed state")
  console.log(newState)
  
  return newState  
}

/*=== REACT COMPONENTS ===*/

// Counter: Displays a counter and buttons to increment/decrement
class Counter extends Component {
  constructor(props) {
    super(props)

    let _store = props.store   //Get the store from props

    //Assign desired properties from the store to state
    this.state = {
      count : _store.getState().count,
    }

    //STEP 3: Call the store's dispatch with the Increment Action
    //Dispatch actions to the store
    this.dispatch = (action) => {
      console.log(`Dispatching ${action}`)
      _store.dispatch(action)
    
      //Note: Listeners not necessary if we update state
      //with return value of STORE.dispatch
      //this.setState(_store.dispatch(action))
    }
    
    //Subscribe a function as a listener to update state
    _store.subscribe((value, store) => {
      //STEP 12: Our listener is called after the store is updated. Update
      //         our state with the desired value from the store's new state
      console.log("Counter Component received notification that state is updated")
      this.setState({count: value})
    }, 'count')
  }
  
  //STEP 2: After clicking the "+" button, our dispatch is called
  //Method for incrementing counter
  increment = () => {
    this.dispatch(Store.ACTIONS.Increment)
  };

  //Method for decrementing counter
  decrement = () => {
    this.dispatch(Store.ACTIONS.Decrement)
  };
  
  render() {
    return (
      <div>
        {/* STEP 13: Counter displays as new value */}
        {console.log("Counter re-rendered with new state from store")}
        <h1>Counter: {this.state.count}</h1> 
        <button onClick={this.decrement}>-</button>
        <button onClick={this.increment}>+</button>
      </div>
    )
  }
}

// Random: Displays a random number between either 1 - 10 or 1 - 100
class Random extends Component {
  constructor(props) {
    super(props)

    let _store = props.store   //Get the store from props

    //Assign desired properties from the store to state
    this.state = {
      random : _store.getState().random
    }

    //Dispatch actions to the store
    this.dispatch = (action) => {
      _store.dispatch(action)
    
      //Note: Listeners not necessary if we update state
      //with return value of STORE.dispatch
      //this.setState(_store.dispatch(action))
    }
    
    //Subscribe a function as a listener to update state
    _store.subscribe((value, store) => {
      //Note: we will update the state with the value that we are tracking (e.g. random),
      //but our callback is also provided the store itself so we can access any state of the store that we want.
      this.setState({random: value})
    }, 'random')
  }

  //Method for generating a random number from 1 - 10
  random10 = () => {
    this.dispatch(Store.ACTIONS.Random_10)
  };

  //Method for generating a random number from 1 - 100
  random100 = () => {
    this.dispatch(Store.ACTIONS.Random_100)
  };
  
  render() {
    return (
      <div style={{borderTop: 'solid 1px black', marginTop: '30px'}}>
        <h1>Random: {this.state.random}</h1>
        <button onClick={this.random10}>Random b/w 1 and 10</button>
        <button onClick={this.random100}>Random b/w 1 and 100</button>
      </div>
    )
  }
}

// STEP 1: Create a Store
// STEP 1a: Provide the store with the needed reducers
console.log("Create Store")
let myStore = Store.createStore(counter).addReducer(random);

//Can't access state
console.log("Error - trying to directly access state:", myStore._state)
//can access the state
console.log("Correct - accessing state via getState():", myStore.getState())

// Rendor Components on the DOM
ReactDOM.render(<Counter store={myStore} />, document.getElementById('counter'))
ReactDOM.render(<Random store={myStore} />, document.getElementById('random'))

/*

1. Click '+' ==> dispatch(Action.Increment)
2. dispatch(Action.Increment) ==> _store.dispatch(Action.Increment)
3. _store.dispatch(Action.Increment) 
      ==> count(currentState, Action.Increment) 
            ==> return newState
      ==> _state = newState
4. for each listener registered 
      ==> listener()
5.        ==> this.setState(store.getState())
6. UI Updated with new value

*/