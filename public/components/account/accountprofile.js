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

const ProfileInfo = ()=>{
  const alias = van.derive(()=> aliasState.val);
  const publicKey = van.derive(()=> publicKeyState.val);

  async function copyKey(){
    try {
      await navigator.clipboard.writeText(publicKeyState.val);
      console.log('Content copied to clipboard');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
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
            button({onclick:()=>copyKey()},'Public Key:')
          ),
          td(
            input({value:publicKey,readonly:true})
          )
        ),
      )
    )
  );
}

export {
  ProfileInfo
}