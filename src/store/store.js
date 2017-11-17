/*=== Redux-style Store ===*/

//A Definition of a Store
export default class Store {
    // Dispatch Actions
    static ACTIONS = {
        Increment: 'INCREMENT',
        Decrement: 'DECREMENT',
        Random_10: 'RANDOM_10',
        Random_100: 'RANDOM_100'
    }

    // Function to create a new store using a reducer
    static createStore = (reducer) => {
        return new Store(reducer(undefined, {}), reducer)
    }

    constructor(initialState, reducer) {
        let _state = initialState, //Make state private inside of Store
            _reducers = [reducer], //Create array for holding reducers
            _listeners = [] //Array for holding listeners

        //Private method for accessing state. Note that this state is not the same as 
        //React state, but represents the current state of the store.
        let _getState = () => _state

        //Dispatcher that calls reducer on action
        let _dispatch = (action) => {
            console.log(`Dispatch for ${action} received`)

            _reducers.forEach((reducer) => {
                let newState = reducer(_state, action) //Update the State
                if (!isEquivalent(newState, _state)) {
                    console.log("store updating state")
                    _state = newState
                }
            })

            console.log("Store notifying listeners that state is changed")
            _listeners.forEach((listener) => {
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
            _listeners.push({
                callback: callback,
                property: property
            })
            return this
        }
    }
}

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