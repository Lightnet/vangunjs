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

const accountChangePassphrase = ()=>{
  const alias = van.state('');

  const PassphraseOld = van.state('012345678');
  const PassphraseNew = van.state('012345678');

  function btnApply(){
    const gun = gunState.val;
    console.log(PassphraseOld.val);
    console.log(PassphraseNew.val);
    const user = gun.user();
    console.log(user);
    alias.val = user.is.alias;

    user.auth(alias.val, PassphraseOld.val, (ack)=>{
      console.log(ack);
      if(ack.err){
        console.log("FAIL")
      }
    },{change: PassphraseNew.val})

  }

  return div(
    table(
      tbody(
        tr(
          td(
            label('Alias:')
          ),
          td(
            label({}, alias)
          )
        ),
        tr(
          td(
            label('Passprhase Old:')
          ),
          td(
            input({value:PassphraseOld,oninput:(e)=>PassphraseOld.val=e.target.value})
          )
        ),
        tr(
          td(
            label('Passprhase New:')
          ),
          td(
            input({value:PassphraseNew,oninput:(e)=>PassphraseNew.val=e.target.value})
          )
        ),
        tr(
          td({colspan:2}, button({onclick:()=>btnApply()},'Apply'))
        )
      )
    )
  );
}

export {
  accountChangePassphrase
}