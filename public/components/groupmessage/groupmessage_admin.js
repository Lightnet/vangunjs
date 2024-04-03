/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

// for group message
// https://github.com/Lightnet/jsvuegunui/blob/main/src/components/groupmessage/GroupMessage.vue

import { Router, Link, navigate, getRouterPathname, getRouterParams } from "vanjs-routing";
import van from "vanjs-core";
import { Modal } from 'vanjs-ui'; //modal
const {button, div, label, select, option, input, p, table, tbody, tr, td, thead} = van.tags;

import { gunState, isLogin, board } from '../context.js';
import { gunUnixToDate } from '../../libs/helper.js';
import { DisplayAlias } from "../account/displayalias.js";

import { GroupMessageCerts } from "./groupmessage_certs.js";
import { MembersPending } from "./groupmessage_pending.js";
import { GroupMessageMembers } from "./groupmessage_members.js";

//check for current group access and information.
const GroupMessageAdminPanel = ({closed,roomID})=>{

  const view = van.state("certs");

  const viewRender = van.derive(()=>{

    if(view.val == "certs"){
      return GroupMessageCerts({roomID:roomID})
    }
    if(view.val == "members"){
      return GroupMessageMembers({roomID:roomID})
    }
    if(view.val == "pending"){
      return MembersPending({roomID:roomID})
    }
  })

  return div({style:"width:800px;height:400px;"},
    div(
      button({onclick:()=>closed.val=true},'X')
    ),
    div(
      //button({onclick:()=>view.val='information'},'Information'),
      button({onclick:()=>view.val='members'},'Members'),
      button({onclick:()=>view.val='pending'},'Pending'),
      //button({onclick:()=>view.val='blacklist'},'Blacklist'),
      button({onclick:()=>view.val='certs'},'Certs'),
    ),
    viewRender
  )
}

export {
  GroupMessageAdminPanel
}