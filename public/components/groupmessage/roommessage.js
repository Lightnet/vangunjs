/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

//tests

import van from "vanjs-core";
import { Router, Link, navigate, getRouterPathname, getRouterParams } from "vanjs-routing";
import { Modal } from 'vanjs-ui'; //modal

const {button, div, label, select, option, input, p, table, tbody, tr, td, thead} = van.tags;
import { gunState, isLogin, board } from '../context.js';
import { gunUnixToDate } from '../../libs/helper.js';
import { DisplayAlias } from "../account/displayalias.js";
import { GroupMessageAdminPanel } from "./groupmessage_admin.js";



function ELGroupMessageRoom(){

  const closed = van.state(false); //this will clean up I think.
  const closedAdmin = van.state(false);
  const roomName = van.state('None');
  const messages = van.state(new Map());
  const ElMessages = div({style:"background-color:lightgray;width:600px;height:400px;overflow-y: scroll;"});
  const _groupID = van.state('');
  const message = van.state('');
  const shareKey = van.state('');
  const isInit = van.state(false);
  const isAdmin = van.state(false);
  const gunNodeMessage = van.state(null);

  van.derive(() => {
    //console.log(getRouterParams()); // { section: "profile" }
    const {roomid} = getRouterParams();
    if(roomid){
      console.log("FOUND");
      _groupID.val = roomid;
    }else{
      console.log("NOT FOUND");
    }
  });

  van.derive(()=>{
    //console.log("groupID:", groupID);
    //_groupID.val = groupID;
    let id = _groupID.val;
    //looping call?
    if(typeof id === 'string' && id.length > 0 && isInit.val == false){
      console.log("init room id: ",id);
      isInit.val = true;
      if(!gunNodeMessage.val){
        console.log("gunNodeMessage.val: ", gunNodeMessage.val)
        initGroupMessage();
      }
      
    }
  });

  van.derive(()=>{
    ElMessages.innerText = '';
    const messageNodes = messages.val;
    if(messageNodes.size > 0){
      for (const [key, userData] of messageNodes) {
        //console.log(`${key} = ${userData}`);
        //console.log(userData);
        van.add(ElMessages, div({id:key},userData.content));
      }
    }
  })

  function callLeave(){
    if(typeof api === 'function'){
      api({action:'leave'});
    }else{
      closed.val = true;
      //routeTo('groupmessage');
    }
    navigate('/',{replace:true});
    closed.val = true;
  }

  async function initGroupMessage(){
    //console.log("init :", _groupID.val);
    //NEED gun instance for leaks and cleanup.
    if(gunNodeMessage.val){
      gunNodeMessage.val.off();//turn off listen
    }

    const gunInstance = Gun(location.origin+"/gun");

    const gun = gunState.val;
    const user = gun.user();
    const userPair = user._.sea;
    gunInstance.user().auth(userPair, async () => {
      //console.log(user);
      if(!user.is){
        //console.log("user.is", user.is);
        return;
      }
      if(!userPair){
        //console.log("userPair", userPair);
        return;
      }

      const room = gunInstance.user(_groupID.val);
      let who = await room.then() || {};//get alias data
      //console.log("room Data: ",who);
      //TODO ENCODE
      if(!who.certs){console.log("No certs!");return;}
      let alias_obj = await room.get('host').then();
      let alias_keys = Object.keys(alias_obj);
      for(let i = 0;i < alias_keys.length;++i){
        if(Gun.SEA.opt.pub("~"+alias_keys[i])){
          if(alias_keys[i] == userPair.pub){//match admin pub
            isAdmin.val = true;
            break;
          }
        }
      }
      //let dec = await Gun.SEA.secret(who.epub, userPair);
      //const cert = await room.get('certs').get('message').then();
      let encsharekey = await room.get('keys').get('messages').get(userPair.pub);
      if(encsharekey==null){
        //console.log("encsharekey NULL");
        return;
      }
      //console.log(encsharekey);
      let dh = await SEA.secret(who.epub, userPair);
      let _shareKey = await SEA.decrypt(encsharekey, dh);
      //console.log("shareKey: ", _shareKey);
      if(_shareKey==null){
        //console.log("shareKey NULL");
        return;
      }
      shareKey.val = _shareKey;

      room.get('messages').get(userPair.pub).map().once(async (data,key)=>{
        //console.log("data: ", data);
        //console.log("key: ", key);
        let content = await Gun.SEA.decrypt(data.content, shareKey.val);
        //let content = data.content;
        //console.log("content: ",content);
        if(content){//check if exist
          messages.val = new Map(messages.val.set(key, {content:content}))
        }
      });
      gunNodeMessage.val = room.get('messages');
    });

  }

  async function sentMessage(){
    //console.log("_groupID.val: ", _groupID.val);
    const gun = gunState.val;
    const user = gun.user();
    const userPair = user._.sea;
    const gunInstance = Gun(location.origin+"/gun");
    //gun instance
    gunInstance.user().auth(userPair, async () => {
      const room = gunInstance.user(_groupID.val);
      let who = await room.then() || {};//get alias data
      //console.log("room Data: ",who);
      if(!who.certs){console.log("No certs!");return;}
      const cert = await room.get('certs').get('messages').then();

      //need to rework the build later...
      //let sec = await Gun.SEA.secret(who.epub, userPair); // Diffie-Hellman
      let enc_content = await Gun.SEA.encrypt(message.val, shareKey.val); //encrypt message
      //let enc_content = message.val;
      room.get('messages').get(userPair.pub).get(Gun.state()).put({
        content:enc_content
      },(ack)=>{
        //console.log(ack);
        if(ack.err){
          board.show({message: ack.err, durationSec: 1});
        }
      },{opt:{cert:cert}})
    });

  }
  
  function btnGetInfo(){
    console.log("_groupID: ",_groupID.val)
  }

  async function copyRoomId(){
    try {
      await navigator.clipboard.writeText(_groupID.val);
      board.show({message: "Copy Room ID!", durationSec: 1});
      //console.log('Content copied to clipboard');
    } catch (err) {
      //console.error('Failed to copy: ', err);
      board.show({message: "Fail Copy Room ID!", durationSec: 1});
    }
  }

  async function showOptions(){

  }

  async function checkGroupMessageInfo(){
    const groupId = _groupID.val;
    const gun = gunState.val;
    const user = gun.user();
    const room = gun.user(groupId);
    const roomData = await gun.user(groupId).then();

    //isAdmin.val
    let alias_obj = await room.get('host').then();
    let alias_keys = Object.keys(alias_obj);
    let pub = "";
    for(let i = 0;i < alias_keys.length;++i){
      if(Gun.SEA.opt.pub("~"+alias_keys[i])){
        if(alias_keys[i] == userPair.pub){
          isAdmin.val = true;
          break;
        }
      }
    }
    let owner = await gun.user(pub).then();
    //console.log(owner);
    if(!owner.alias){
      //console.log("Can't find Alias Name!");
      return;
    }
    //console.log(roomData);
    roomName.val = roomData.alias;
  }

  const currentRoomName = van.derive(()=>roomName.val);

  function btnShowAdmin(){
    closedAdmin.val = false;
    van.add(document.body, Modal({closed:closedAdmin},
      GroupMessageAdminPanel({closed:closedAdmin,roomID:_groupID.val}),
    ))
  }

  //checkGroupMessageInfo();

  return closed.val ? null : div({id:_groupID.val},
    div(
      //button({onclick:()=>navigate('/',{replace:true})},'Back'),
      button({onclick:()=>callLeave()},'Leave'),
      button({onclick:()=>showOptions()},'Options'),
      van.derive(()=>{
        if(isAdmin.val){
          return button({onclick:()=>btnShowAdmin()},'Admin');
        }else{
          return button({disabled:true},'Admin');
        }
      }),
      label(" [Alias: "),
      DisplayAlias(),
      ' ] ',
    ),
    div(
      label({onclick:()=>copyRoomId()},"Room Name:"),
      label(currentRoomName),
    ),
    div(
      label({onclick:()=>copyRoomId()},"Room ID:"),
      input({readonly:true,value:_groupID}),
    ),
    ElMessages,
    div(
      input({valueL:message,oninput:e=>message.val=e.target.value}),
      button({onclick:()=>sentMessage()},'Sent'),
      button({onclick:()=>btnGetInfo()},'info')  
    )
  )
}


export {
  ELGroupMessageRoom
}