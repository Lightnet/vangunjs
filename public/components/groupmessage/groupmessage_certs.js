/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

// for group message
// https://github.com/Lightnet/jsvuegunui/blob/main/src/components/groupmessage/GroupMessage.vue

//import { Router, Link, navigate, getRouterPathname, getRouterParams } from "vanjs-routing";
import van from "vanjs-core";
//import { Modal } from 'vanjs-ui'; //modal
const {button, div, label, select, option, input, p, table, tbody, tr, td, thead} = van.tags;

import { gunState, isLogin, board } from '../context.js';
// import { gunUnixToDate } from '../../libs/helper.js';
// import { DisplayAlias } from "../account/displayalias.js";


const GroupMessageCerts = ({roomID})=>{

  async function btnApplyMessage1Day(){
    //console.log("roomID: ", roomID)
    const gun = gunState.val;
    const user = gun.user();
    const room = gun.user(roomID);
    const roomData = await room.then();
    if(!roomData.host){
      //console.log("NO HOST");
      return;
    }
    let roomPair = {};
    const userPair = user._.sea;
    //console.log("userPair: ", userPair);
    let encRoomPair = await room.get('host').get(userPair.pub).then()
    //encRoomPair
    roomPair = await SEA.decrypt(encRoomPair, userPair);
    //console.log("roomPair: ",roomPair);
    if(!roomPair){
      //console.log("FAIL ROOM PAIR");
      return;
    }
    let expireTime = Gun.state() + (60*60*25*1000);

    const cert_messages = await Gun.SEA.certify( 
      '*',  // everybody is allowed to write
      { '*':'messages', '+': '*' }, // to the path that starts with 'message' and along with the key has the user's pub in it
      roomPair, //authority
      null, //no need for callback here
      { expiry: expireTime } // Let's set a one day expiration period
    );
    //console.log("cert_messages: ", cert_messages)

    const gunInstance = Gun(location.origin+"/gun");
    gunInstance.user().auth(roomPair, async () => {
      gunInstance.user().get('certs')
        .get('messages')
        .put(cert_messages);
    })
  }

  async function btnApplyPending1Day(){
    //console.log("roomID: ", roomID)
    const gun = gunState.val;
    const user = gun.user();
    const room = gun.user(roomID);
    const roomData = await room.then();
    if(!roomData.host){
      //console.log("NO HOST");
      return;
    }
    let roomPair = {};
    const userPair = user._.sea;
    //console.log("userPair: ", userPair);
    let encRoomPair = await room.get('host').get(userPair.pub).then()
    //encRoomPair
    roomPair = await SEA.decrypt(encRoomPair, userPair);
    //console.log("roomPair: ",roomPair);
    if(!roomPair){
      //console.log("FAIL ROOM PAIR");
      return;
    }
    let expireTime = Gun.state() + (60*60*25*1000);

    const cert_pending = await Gun.SEA.certify( 
      '*',  // everybody is allowed to write
      { '*':'pending', '+': '*' }, // to the path that starts with 'message' and along with the key has the user's pub in it
      roomPair, //authority
      null, //no need for callback here
      { expiry: expireTime } // Let's set a one day expiration period
    );
    //console.log("cert_pending: ", cert_pending)

    const gunInstance = Gun(location.origin+"/gun");
    gunInstance.user().auth(roomPair, async () => {
      gunInstance.user().get('certs')
        .get('pending')
        .put(cert_pending);
    })
  }

  return div(
    div(
      label(' Message '),
      button({onclick:()=>btnApplyMessage1Day()},'1 Day ')
    ),
    div(
      label(' Pending '),
      button({onclick:()=>btnApplyPending1Day()},'1 Day ')
    )
  )
}

export {
  GroupMessageCerts
}