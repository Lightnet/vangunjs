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

const AccountSubMenus = ()=>{

  return div(
    button({onclick:()=>navigate('/',{replace:true})},'Back'),
    button({onclick:()=>navigate('/account',{replace:true})},'Profile'),
    button({onclick:()=>navigate('/account/changepassphrase',{replace:true})},'Change Passphrase'),
    button({onclick:()=>navigate('/account/hint',{replace:true})},'Hint'),
    button({onclick:()=>navigate('/account/certs',{replace:true})},'Certs'),
  );

}

export {
  AccountSubMenus
}