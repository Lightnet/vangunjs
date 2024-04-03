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


const GroupMessageMembers = ({roomID})=>{

  const userRegisters = van.state(new Map());
  const groupID = van.state(roomID);

  async function btnRefresh(){
    //console.log("roomID: ", roomID);
    //console.log("groupID: ", groupID.val);
    const gun = gunState.val;
    //const user = gun.user();
    const room = gun.user(roomID);
    const roomData = await room.then();
    if(!roomData.host){
      //console.log("NO HOST");
      return;
    }

    room.get('members').map().once(async (data,key)=>{
      //console.log("key:", key)
      //console.log("data:", data)
      let to = gun.user(key);
      let who = await to.then();
      if(!who.alias){
        //console.log("No Alias!");
        return;
      }
      //use map to prevent same copy over lap
      userRegisters.val = new Map(userRegisters.val.set(key,{alias:who.alias,pub:key,data:data}))
    });
  }

  async function btnGrant(id){
    //console.log("id: ",id);
    const gun = gunState.val;
    const to = gun.user(id);
    const who = await to.then();
    if(!who.alias){
      //console.log("No Alias!");
      return;
    }
    //console.log("who: ", who);
    const user = gun.user();
    const userPair = user._.sea;
    const room = gun.user(groupID.val);
    //console.log("userPair: ", userPair)
    const enc_roomPair = await room.get('host').get(user.is.pub).then();
    if(!enc_roomPair){
      //console.log("NOT OWNER");
      return;
    }
    const roomPair = await Gun.SEA.decrypt(enc_roomPair, user._.sea);
    //console.log("roomPair: ", roomPair)
    //instance of gun
    const gunInstance = Gun(location.origin+"/gun");
    //auth to update data node
    gunInstance.user().auth(roomPair, async function(ack){
      //encode key diff
      let dh = await Gun.SEA.secret(userPair.epub, roomPair);
      //get sharekey
      let enc_shareKey = await gunInstance.user().get('keys').get('messages').get(userPair.pub).then();
      let shareKey = await Gun.SEA.decrypt(enc_shareKey, dh);
      //console.log("shareKey: ", shareKey);
      //enc sharekey for new member
      let to_dh = await SEA.secret(who.epub, roomPair);
      enc_shareKey = await SEA.encrypt(shareKey, to_dh);

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

  async function btnRevoke(id){
    //console.log("id: ",id);
    const gun = gunState.val;
    const to = gun.user(id);
    const who = await to.then();
    if(!who.alias){
      //console.log("No Alias!");
      return;
    }
    //console.log("who: ", who);
    const user = gun.user();
    const userPair = user._.sea;
    const room = gun.user(groupID.val);
    //console.log("userPair: ", userPair)
    const enc_roomPair = await room.get('host').get(user.is.pub).then();
    if(!enc_roomPair){
      //console.log("NO OWNER");
      return;
    }
    //console.log(enc_roomPair);
    const roomPair = await Gun.SEA.decrypt(enc_roomPair, user._.sea);
    //console.log("roomPair: ", roomPair);

    //instance of gun
    const gunInstance = Gun(location.origin+"/gun");
    //auth to update data node
    gunInstance.user().auth(roomPair, async function(ack){

      gunInstance.user().get("members").get(who.pub).get('ban').put(1);
      let enc_shareKey = await gunInstance.user().get('keys').get('messages').get(userPair.pub).then();
      let dh = await Gun.SEA.secret(userPair.epub, roomPair);
      let shareKey = await Gun.SEA.decrypt(enc_shareKey, dh);
      //console.log("shareKey: ", shareKey);
      //save backup admin only access
      gunInstance.user()
        .get("keyrecords")
        .get('messages')
        .get(""+Gun.state())//time stamp
        .put(enc_shareKey);

      let genSharekey = String.random(16);
      //console.log("genSharekey: ", genSharekey);

      gunInstance.user().get("members").map().once(async (data,key)=>{
        //console.log("key:", key)
        //console.log("data:", data)
        let to = gun.user(key);
        let who = await to.then();
        //check for ban later...
        if(!who.alias){
          //console.log("No Alias!");
          return;
        }
        //enc key
        let enc_share_key = "null";
        if(data?.ban == 1){
          //if ban default "null" as string
        }else{
          let dh = await SEA.secret(who.epub, roomPair);
          enc_share_key = await SEA.encrypt(genSharekey, dh);
        }
        gunInstance.user()
        .get('keys')
        .get('messages')
        .get(who.pub)
        .put(enc_share_key);
        
      });

    });

  }

  function btnBan(id){
    console.log("id: ",id);
  }

  async function btnGenShareKey(){
    const gun = gunState.val;
    const user = gun.user();
    const userPair = user._.sea;
    const room = gun.user(groupID.val);
    //console.log(user.is.pub)
    //console.log(user._.sea)
    const enc_roomPair = await room.get('host').get(user.is.pub).then();
    if(!enc_roomPair){
      //console.log("NOT OWNER");
      return;
    }

    //console.log(enc_roomPair)
    const roomPair = await Gun.SEA.decrypt(enc_roomPair, user._.sea);
    //instance of gun
    const gunInstance = Gun(location.origin+"/gun");
    //auth to update data node
    gunInstance.user().auth(roomPair, async function(ack){

      //get share keys
      let dh = await Gun.SEA.secret(userPair.epub, roomPair);
      let enc_shareKey = await gunInstance.user().get('keys').get('messages').get(userPair.pub).then();

      //save backup admin only access
      gunInstance.user()
        .get("keyrecords")
        .get('messages')
        .get(""+Gun.state())//time stamp
        .put(enc_shareKey);

      let shareKey = await Gun.SEA.decrypt(enc_shareKey, dh);
      //console.log("shareKey: ", shareKey);
      // create share key
      let genSharekey = String.random(16);
      //console.log("genSharekey: ", genSharekey);

      gunInstance.user().get("members").map().once(async (data,key)=>{
        //console.log("key:", key)
        console.log("data:", data)
        if(data?.ban==1){
          return;
        }
        let to = gun.user(key);
        let who = await to.then();
        //check for ban later...
        if(!who.alias){
          //console.log("No Alias!");
          return;
        }
        //enc key
        let dh = await SEA.secret(who.epub, roomPair);
        const enc_share_key = await SEA.encrypt(genSharekey, dh);
        gunInstance.user()
        .get('keys')
        .get('messages')
        .get(who.pub)
        .put(enc_share_key);
        
      });

    });
  }

  return div(
    div(
      button({onclick:()=>btnRefresh()},"Refresh"),
      label(" List "),
      button({onclick:()=>btnGenShareKey()},"Generate New Share Key!"),
    ),
    div(
      van.derive(()=>{
        let userDatas = [];
        let users = userRegisters.val;
        users.forEach( (data, key, map) => {
          //console.log(data);
          userDatas.push(tr(
            td(
              label({},data.alias),
            ),
            td(
              input({value:key,readonly:true}),
            ),
            td(
              label(data.data.ban),
            ),
            td(
              button({onclick:()=>btnGrant(key)}," Grant "),
              button({onclick:()=>btnRevoke(key)}," Revoke "),
              //button({onclick:()=>btnBan(key)}," Ban "),
            )
          ));
        });

        return table(
          thead(
            tr(
              td(label(' Alias: ')),
              td(label(' Public Key: ')),
              td(label(' Ban: ')),
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
  GroupMessageMembers
}
