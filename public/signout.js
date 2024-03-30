/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import { van } from '/dps.js';
import { navigate } from "vanjs-routing";
import { 
  gunState,
  isLogin,
  aliasState,
  publicKeyState
} from '/context.js';
import { MessageBoard } from "vanjs-ui";
import { ElDisplayAlias } from './account.js';

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
    ElDisplayAlias(),
    ' ',
    button({onclick:()=>signout()},' Logout '),
    label(" ? "),
  );
}

export {
  btnSignOut
}