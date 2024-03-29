/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import { van, routeTo } from '/dps.js';
const {button, div, pre, a , li, p, ul} = van.tags;

const btnBackHome = ()=>{

  return button({ onclick: () => routeTo('home') }, 'Back To Home');
}

export {
  btnBackHome
}