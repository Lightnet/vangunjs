/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import van from 'van';
import { navigate } from "vanjs-routing";
import { DisplayAlias } from '../account/displayalias.js';

const { div, button, input, textarea, label, table, tbody, tr, td, select, option } = van.tags;

function PrivateMessageMenus(){
  return div(
    button({onclick:()=>navigate('/')},'Back'),
    button({onclick:()=>navigate('/privatemessage')},' Message '),
    button({onclick:()=>navigate('/privatemessage/compose')},' Compose '),
    button({onclick:()=>navigate('/privatemessage/options')},' Options '),
    label(' [Alias: '),
    DisplayAlias(),
    label(' ] ')
  );
}

export{
  PrivateMessageMenus
}