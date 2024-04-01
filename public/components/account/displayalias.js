/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import van from 'van';
import { isLogin, aliasState, gunState, publicKeyState, board } from '../context.js';
import { navigate } from "vanjs-routing";
const {button, div, table, tbody, tr, td, label, input, center } = van.tags;

const DisplayAlias = ()=>{
  const userName = van.derive(()=>aliasState.val);
  return label(userName)
}

export {
  DisplayAlias
}