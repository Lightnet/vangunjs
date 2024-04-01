/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import van from 'van';
import { MessageBoard } from 'vanjs-ui';
import { navigate } from 'vanjs-routing';
import { gunState, isLogin, aliasState, publicKeyState } from '../context.js';
import { DisplayAlias } from '../account/displayalias.js';

const {div, button, label } = van.tags;

const btnSignOut = ()=>{
  const board = new MessageBoard({top: "20px"})

  function signout(){
    const gun = gunState.val;
    gun.user().leave();
    isLogin.val = false;
    aliasState.val = 'Guest';
    publicKeyState.val = '';
    board.show({message: "Logout!", durationSec: 1});
    navigate('/',{replace:true})
  }
  return div(
    label("Are you sure "),
    DisplayAlias(),
    ' ',
    button({onclick:()=>signout()},' Logout '),
    label(" ? "),
    button({onclick:()=>navigate('/',{replace:true})},' Cancel '),
  );
}

export {
  btnSignOut
}