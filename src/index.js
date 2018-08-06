/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import skygear from 'skygear';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Set your own endPoint and apiKey here, overwrite these values
const endPoint = 'https://demo934.skygeario.com/';
const apiKey = 'c3f090ac5a954c2b82b63a1623acfee9';

skygear.config({
  endPoint,
  apiKey,
}).then(value => console.info(value))
  .then(() => {
    ReactDOM.render(<App />, document.getElementById('root'));
    registerServiceWorker();
  })
  .catch(error => console.error(error));

/* eslint-enable react/jsx-filename-extension */
