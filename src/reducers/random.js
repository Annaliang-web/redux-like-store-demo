import Store from '../store/store';

// Random Reducer: generates a random number either up to 10 or 100
export const random = (state = { random: 0 }, action) => {
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