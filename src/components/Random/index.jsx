import React, { Component } from 'react';
import Store from '../../store/store';
import RaisedButton from 'material-ui/RaisedButton'

// Random: Displays a random number between either 1 - 10 or 1 - 100
export default class Random extends Component {
    constructor(props) {
        super(props)

        let _store = props.store   //Get the store from props

        //Assign desired properties from the store to state
        this.state = {
            random: _store.getState().random
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
            this.setState({ random: value })
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
        let style = {
            margin: 12
        }
        return (
            <div style={{ borderTop: 'solid 1px black', marginTop: '30px' }}>
                <h1>Random: {this.state.random}</h1>
                <RaisedButton onClick={this.random10} label="Random b/w 1 and 10" style={style} />
                <RaisedButton onClick={this.random100} label="Random b/w 1 and 100" style={style} />
            </div>
        )
    }
}