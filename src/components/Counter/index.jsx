import React, { Component } from 'react';
import Store from '../../store/store';
import RaisedButton from 'material-ui/RaisedButton'

// Counter: Displays a counter and buttons to increment/decrement
export default class Counter extends Component {
    constructor(props) {
      super(props)
  
      let _store = props.store   //Get the store from props
  
      //Assign desired properties from the store to state
      this.state = {
        count : _store.getState().count,
      }
  
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
    
    //Method for incrementing counter
    increment = () => {
      this.dispatch(Store.ACTIONS.Increment)
    };
  
    //Method for decrementing counter
    decrement = () => {
      this.dispatch(Store.ACTIONS.Decrement)
    };
    
    render() {
      let style = {
          margin: 12
      }  
      return (
        <div>
          {console.log("Counter re-rendered with new state from store")}
          <h1>Counter: {this.state.count}</h1> 
          <RaisedButton onClick={this.decrement} label="-" style={style} secondary={true} />
          <RaisedButton onClick={this.increment} label="+" style={style} primary={true} />
        </div>
      )
    }
  }