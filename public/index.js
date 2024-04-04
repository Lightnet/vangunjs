/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import van from 'vanjs-core';
import App from './components/app.js';

van.add(document.body, App());

// Testing bun websocket work
// import 'https://cdn.jsdelivr.net/npm/gun/gun.js';
// var gun = GUN("http://127.0.0.1:1337/gun");