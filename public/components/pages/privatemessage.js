/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import van from "van";
import { navigate, getRouterParams } from "vanjs-routing";
import { PrivateMessageMenus } from '../privatemessage/submenu.js';
import { PrivateMessageInbox } from "../privatemessage/inbox.js";
import { PrivateMessageCompose } from "../privatemessage/compose.js";
import { PrivateMessageOptions } from "../privatemessage/options.js";

const { div } = van.tags;

const PrivateMessagePage = () =>{
  van.derive(()=>{
    console.log(getRouterParams());
  })
  return div(
    PrivateMessageMenus(),
    PrivateMessageInbox()
  );
}

const PrivateMessageOptionsPage = () =>{
  return div(
    PrivateMessageMenus(),
    PrivateMessageOptions()
  );
}

const PrivateMessageComposePage = () =>{
  return div(
    PrivateMessageMenus(),
    PrivateMessageCompose()
  );
}

export{
  PrivateMessagePage,
  PrivateMessageComposePage,
  PrivateMessageOptionsPage
}

