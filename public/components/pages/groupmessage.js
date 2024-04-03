/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

//import van from 'van';
import { GroupMessageLobby } from '../groupmessage/groupmessage.js';
import { ELGroupMessageRoom } from '../groupmessage/roommessage.js';
//const { div } = van.tags;

//main group message
const GroupMessagePage = ()=>{
  return GroupMessageLobby();
}
//chat room messages
const RoomMessagePage = ()=>{
  return ELGroupMessageRoom();
}

export {
  GroupMessagePage,
  RoomMessagePage
}