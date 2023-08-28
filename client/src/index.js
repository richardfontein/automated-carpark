import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';
import App from './App';
import 'react-datepicker/dist/react-datepicker.css';
import './fontawesome';
import './scss/custom.scss';
import 'dotenv/config';

WebFont.load({
  google: {
    families: ['Montserrat:400,600', 'sans-serif'],
  },
});
ReactDOM.render(<App />, document.getElementById('main'));
