import React from 'react';
import { render } from 'react-dom'
import './index.css';
import { Provider } from 'react-redux'
import App from './App';
import {rootReducer, fetchDataRequest} from "./reducers"
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
store.dispatch(fetchDataRequest)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
