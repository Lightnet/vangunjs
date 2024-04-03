/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import van from 'van';
import { ElGroupMessage } from '../groupmessage/groupmessage.js';
import { ELGroupMessageRoom } from '../groupmessage/roommessage.js';

const { div } = van.tags;

const GroupMessagePage = ()=>{
  return ElGroupMessage();
}

const RoomMessagePage = ()=>{
  return ELGroupMessageRoom();
}

export {
  GroupMessagePage,
  RoomMessagePage
}