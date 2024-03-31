/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

//import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.5.0.min.js"
//import { Route, routeTo } from '/vanjs-router.js';
//import {van} from '/dps.js';

import van from 'vanjs-core';
import App from './components/app.js';

van.add(document.body, App())