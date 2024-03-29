/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import { van, routeTo } from '/dps.js';

import { 
  gunState,
  isLogin,
  aliasState,
  publicKeyState
} from '/context.js';
import { MessageBoard } from "vanjs-ui";

const {button} = van.tags;

const btnSignOut = ()=>{
  const board = new MessageBoard({top: "20px"})

  function signout(){
    const gun = gunState.val;
    gun.user().leave();
    isLogin.val = false;
    aliasState.val = 'Guest';
    publicKeyState.val = '';
    board.show({message: "Logout!", durationSec: 1});
    routeTo('home');
  }
  return button({onclick:()=>signout()},' Logout ');
}

export {
  btnSignOut
}