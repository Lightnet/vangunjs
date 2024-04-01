/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import van from 'van';
import { AccountSubMenus } from "../account/accountsubmenu.js";
import { ProfileInfo } from '../account/accountprofile.js';
import { accountChangePassphrase } from '../account/accountchangepassphrase.js';
import { accountHint } from '../account/accounthint.js';
import { accountCerts } from '../account/accountcerts.js';

const {button, div, table, tbody, tr, td, label, input, center } = van.tags;

const AccountPage = ()=>{
  return div(
    AccountSubMenus(),
    ProfileInfo()
  );
}

const AccountChangePassphrasePage = ()=>{
  return div(
    AccountSubMenus(),
    accountChangePassphrase()
  );
}

const AccountHintPage = ()=>{
  return div(
    AccountSubMenus(),
    accountHint()
  );
}

const AccountCertsPage = ()=>{
  return div(
    AccountSubMenus(),
    accountCerts()
  );
}

export{
  AccountPage,
  AccountChangePassphrasePage,
  AccountHintPage,
  AccountCertsPage
}