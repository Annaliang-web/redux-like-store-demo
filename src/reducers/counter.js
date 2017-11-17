import Store from '../store/store';

// Counter Reducer: Increments or decrements a value
export const counter = (state = { count: 0 }, action) => {
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
  