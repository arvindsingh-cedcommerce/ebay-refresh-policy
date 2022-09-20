import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";
import {AppProvider} from "@shopify/polaris";
// import '@shopify/polaris/dist/styles.css';
import {NotificationContainer} from "react-notifications";
// import {theme} from "./PolarisComponents/theme-skins";
import { Provider } from 'react-redux';
// import configureStore from "./store/configureStore";
import '@shopify/polaris/build/esm/styles.css';
import 'antd/dist/antd.css';
import store from './redux/store';
// import '../src/styles/styles.css'

// const store = configureStore();

const theme = {
    colors: {
      primary: '#084e8a',

    },
};

ReactDOM.render(
        <BrowserRouter basename='/ebay'>
            <AppProvider i18n={{}} theme={theme}>
                <Provider store={store}>
                    <App />
                </Provider>
            </AppProvider>
            <NotificationContainer/>
        </BrowserRouter>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
