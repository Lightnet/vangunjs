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
//import { gunUnixToDate } from '../../libs/helper.js';
//import { DisplayAlias } from "../account/displayalias.js";

const MembersPending = ({roomID})=>{

  const userRegisters = van.state(new Map());
  const groupID = van.state(roomID);

  async function btnRefresh(){
    //console.log("roomID: ", roomID)
    //console.log("groupID: ", groupID.val)
    const gun = gunState.val;
    const user = gun.user();
    const room = gun.user(roomID);
    const roomData = await room.then();
    if(!roomData.host){
      //console.log("NO HOST");
      return;
    }

    room.get('pending').map().once(async (data,key)=>{
      //console.log("key:", key)
      //console.log("data:", data)
      let to = gun.user(key);
      let who = await to.then();
      if(!who.alias){
        //console.log("No Alias!");
        return;
      }
      //use map to prevent same copy over lap
      userRegisters.val = new Map(userRegisters.val.set(key,{alias:who.alias, pub:key, data:data}))
    });
  }

  async function btnApprove(id){
    //console.log("id: ",id);
    const gun = gunState.val;

    let to = gun.user(id);
    let who = await to.then();
    if(!who.alias){
      //console.log("No Alias!");
      return;
    }
    //console.log("who: ", who);
    const user = gun.user();
    const userPair = user._.sea;
    const room = gun.user(roomID);
    //console.log("userPair: ", userPair)
    const enc_roomPair = await room.get('host').get(user.is.pub).then();
    //console.log(enc_roomPair)
    const roomPair = await Gun.SEA.decrypt(enc_roomPair, user._.sea);
    //console.log("roomPair: ", roomPair)
    //auth to update data node
    const gunInstance = Gun(location.origin+"/gun");
    gunInstance.user().auth(roomPair, async function(ack){
      //gunInstance.user().get('pending').get(id).put('Rejected');
      let dh = await Gun.SEA.secret(userPair.epub, roomPair);
      //get sharekey
      let enc_shareKey = await gunInstance.user().get('keys').get('messages').get(userPair.pub).then();
      let shareKey = await Gun.SEA.decrypt(enc_shareKey, dh);
      //console.log("shareKey: ", shareKey);

      //enc sharekey for new member
      let to_dh = await SEA.secret(who.epub, roomPair);
      enc_shareKey = await SEA.encrypt(genSharekey, to_dh);

      gunInstance.user()
        .get('keys')
        .get('messages')
        .get(who.pub)
        .put(enc_shareKey); // ?

      gunInstance.user()
        .get('members')
        .get(who.pub)
        .put({
          role:"member",
          //cert:"",
          //key:"",
          ban:0
        });
    });

  }

  async function btnReject(id){
    const gun = gunState.val;
    const user = gun.user();
    const room = gun.user(roomID);
    //console.log(user.is.pub)
    //console.log(user._.sea)
    //decode to get pair key room from owner alias
    const enc_roomPair = await room.get('host').get(user.is.pub).then();
    //console.log(enc_roomPair)
    const roomPair = await Gun.SEA.decrypt(enc_roomPair, user._.sea);
    //auth to update data node
    const gunInstance = Gun(location.origin+"/gun");
    gunInstance.user().auth(roomPair, async function(ack){
      gunInstance.user().get('pending').get(id).put('rejected');
    });
  }

  return div(
    div(
      button({onclick:()=>btnRefresh()},"Refresh"),
      label(" List "),
    ),
    div(
      van.derive(()=>{
        let userDatas = [];
        let users = userRegisters.val;
        users.forEach( (data, key, map) => {
          userDatas.push(tr(
            td(
              label({},data.alias),
            ),
            td(
              input({value:key,readonly:true}),
            ),
            td(
              button({onclick:()=>btnApprove(key)}," Approve "),
              button({onclick:()=>btnReject(key)}," Reject "),
            )
          ));
        });

        return table(
          thead(
            tr(
              td(label(' Alias: ')),
              td(label(' Public Key: ')),
              td(label(' Actions: ')),
            )
          ),
          tbody(
            userDatas
          )
        );
      })
    )
  );
}

export {
  MembersPending
}