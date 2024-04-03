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
import { GroupMessageAdminPanel } from "./groupmessage_admin.js";

const ElGroupMessage =()=>{
  const closed = van.state(false);//create modal
  //const closedOptions = van.state(false);//create group
  const closedDelete = van.state(false);
  const groupName = van.state('');
  const groupInfo = van.state('None');
  const groupID = van.state('');
  const GroupMessageSel = select({style:"width:256px;",onclick:onChangeGroupMessageSel,onchange:onChangeGroupMessageSel});
  const groupMessages = van.state(new Map());
  const isModalCreate = van.state(true);
  const ElRoomInfo = div();
  const isAdmin = van.state(false);
  const isLookUp = van.state(false)

  function onChangeGroupMessageSel(e){
    //console.log(e.target.value)
    //groupID.val = e.target.value;
    let groupData = groupMessages.val.get(e.target.value);
    if(groupData){
      groupID.val = groupData.pub;
    }
  }
  //group messages list select options
  van.derive(()=>{
    const nodes = groupMessages.val;
    //console.log(nodes);
    //if(nodes.size > 0){
      GroupMessageSel.innerText = '';
      van.add(GroupMessageSel, option({disable:true},'Select Group Message'));
      for(const [key, groupData] of nodes){
        if(groupData != "null"){
          //console.log("key: ",key);
          van.add(GroupMessageSel, option({value:key},groupData.alias));
        }
      }
    //}
  })

  async function btnJoin(){
    //api({action:"join", groupID:groupID.val})
    if(typeof groupID.val === 'string' && groupID.val.length != 0 ){
      const gun = gunState.val;
      const roomNode = gun.user(groupID.val);
      const user = gun.user();
      //console.log(user.is.pub);
      let member = await roomNode.get('members').get(user.is.pub).then();
      //console.log("member: ", member)
      if(member){
        //need to check ban...
        //console.log("member: ", member);
        if(member?.ban==1){
          board.show({message: "Rejected current member is Ban !", durationSec: 1});
          return;
        }
      }else{
        board.show({message: "Reject Non Member!", durationSec: 1});
        //console.log("Not Member!");
        return;
      }
      //routeTo('groupmessageroom', [groupID.val]);
      board.show({message: "Join Member!", durationSec: 1});
      //navigate('/groupmessageroom/'+groupID.val,{replace:true})
      let url ='/groupmessageroom/'+groupID.val; 
      navigate(url);
      //closed.val = true;
    }
  }

  function btnShowOptions(){
    
  }

  function btnShowAdmin(){
    van.add(document.body, Modal({closed},
      GroupMessageAdminPanel({closed,roomID:groupID.val}),
    ))
  }

  function btnCreate(){
    //console.log("create???")
    if(typeof groupName.val === 'string' && groupName.val.length === 0){
      //console.log("EMPTY!");
      board.show({message: "Empty Name!", durationSec: 1});
      return;
    }
    isModalCreate.val = true
    //console.log(groupName.val);
    createGroupMessage();
  }

  function btnShowCreate(){
    //console.log("show create");
    isModalCreate.val = false;
    van.add(document.body, Modal({closed:isModalCreate},
      p("Create Group Message!"),
      input({value:groupName, oninput:e=>groupName.val=e.target.value}),
      div({style: "display: flex; justify-content: center;"},
        button({onclick:()=>btnCreate()}, "Ok"),
        button({onclick:()=>isModalCreate.val=true}, "Cancel")
      ),
    ));
  }

  async function createGroupMessage(){
    const gun = gunState.val;
    let roomPair = await Gun.SEA.pair()
    //console.log(roomPair)
    let user = gun.user();
    //console.log(user)
    //console.log(user._.sea)
    let userPair = user._.sea;
    let sec = await Gun.SEA.secret(userPair.pub,userPair); // default?

    let roomData ={
      pub:roomPair.pub,
      alias:groupName.val,
      key:roomPair
    }

    let encode = await Gun.SEA.encrypt(roomData,sec);
    //console.log(encode);
    //generate share key
    const random_id = String.random(16);
    user.get("groupmessages").get(random_id).put(encode);
    // Issue the wildcard certificate for all to write personal items to the 'profile'
    const cert_message = await Gun.SEA.certify( 
      '*',  // everybody is allowed to write
      { '*':'messages', '+': '*' }, // to the path that starts with 'message' and along with the key has the user's pub in it
      roomPair, //authority
      null, //no need for callback here
      { expiry: Gun.state() + (60*60*24*1000) } // Let's set a one day expiration period
    );

    const cert_pending = await Gun.SEA.certify( 
      '*',  // everybody is allowed to write
      { '*':'pending', '+': '*' }, // to the path that starts with 'message' and along with the key has the user's pub in it
      roomPair, //authority
      null, //no need for callback here
      { expiry: Gun.state() + (60*60*24*1000) } // Let's set a one day expiration period
    );

    const gunInstance = Gun(location.origin+"/gun");
    // https://gun.eco/docs/SEA.certify
    // Authenticate with the room pair
    gunInstance.user().auth(roomPair, async () => {
      //need for look up key for decode.
      gunInstance.user()
        .get('epub')
        .put(roomPair.epub);

      // Put the certificate into the room graph for ease of later use
      gunInstance.user()
        .get('certs')
        .get('messages')
        .put(cert_message); //public ? testing...

      gunInstance.user()
        .get('certs')
        .get('pending')
        .put(cert_pending);
      //create share key
      const genSharekey = String.random(16);
      //different key secert encode
      let dh = await SEA.secret(userPair.epub, roomPair);
      const enc_share_key = await SEA.encrypt(genSharekey, dh);

      gunInstance.user()
        .get('keys')
        .get('messages')
        .get(userPair.pub)
        .put(enc_share_key); // ?

      let enc = await SEA.encrypt(roomPair, userPair)
      gunInstance.user()
        .get('host')
        .get(userPair.pub)
        .put(enc);//store room host pub sea pair.
        
      gunInstance.user()
        .get('members')
        .get(userPair.pub)
        .put({
          role:"admin",
          //cert:"",
          key:"",
          ban:0
        });

      gunInstance.user().get('alias').put(groupName.val);
      gunInstance.user().get('information').put(groupInfo.val);
    });
  }

  async function refreshGroupMessages(){
    //GroupMessageSel.innerText = '';
    const gun = gunState.val;
    const user = gun.user();
    let userPair = user._.sea;
    groupMessages.val = new Map();
    user.get("groupmessages").map().once(async (data,key)=>{
      //console.log("data: ",data);
      //console.log("key: ",key);
      if (data == "null"){return;}
      if(data){
        let sec = await SEA.secret(userPair.pub,userPair) // default?

        let decode = await SEA.decrypt(data,sec);
        //console.log("decode: ", decode)
        if(decode){
          groupMessages.val = new Map(groupMessages.val.set(key, decode));
          //console.log(groupMessages.val);
        }
      }
    });
    board.show({message: "Update Group Messages!", durationSec: 1});

  }

  async function btnAddgroupID(){
    const gun = gunState.val;
    const room = gun.user(groupID.val);
    const roomData = await room.then();
    if(!roomData?.host){
      isAdmin.val = false;
      board.show({message: "No Room ID!", durationSec: 1});
      ///console.log("NO HOST!");
      return;
    }
    const user = gun.user();
    const userPair = user._.sea;
    let sec = await Gun.SEA.secret(userPair.pub,userPair)//default?
    var roomInfo = {
      alias:roomData.alias,
      pub:groupID.val,
      information:roomData.information,
    }

    let enc_room = await Gun.SEA.encrypt(roomInfo, sec);
    const random_id = String.random(16);
    user.get("groupmessages").get(random_id).put(enc_room);
    board.show({message: "Group Message Added!", durationSec: 1});

  }

  function showConfirmDeleteGroupID(){
    //closed
    closedDelete.val = false;
    van.add(document.body, Modal({closed:closedDelete},
      p("Delete Group Message Confirm!"),
      input({value:groupID,readonly:true}),
      div({style: "display: flex; justify-content: center;"},
        button({onclick:()=>callDeletegroupID()}, "Ok"),
        button({onclick:()=>closedDelete.val=true}, "Cancel")
      ),
    ));
  }

  async function callDeletegroupID(){
    //console.log(groupID.val);
    const gun = gunState.val;
    const room = gun.user(groupID.val);
    const roomData = await room.then();
    if(!roomData?.host){
      isAdmin.val = false;
      board.show({message: "No Room ID!", durationSec: 1});
      ///console.log("NO HOST!");
      return;
    }

    const nodes = groupMessages.val;
    for(const [key, groupData] of nodes){
      //console.log(groupData);
      if(groupData != "null"){
        if(groupData.pub == groupID.val){
          //console.log("FOUND!", groupData);
          //console.log("key", key);
          const user = gun.user();
          user.get("groupmessages").get(key).put("null");
          groupID.val = "";
          nodes.delete(key);
          //console.log(nodes);
          //if(messageids){//bool
            groupMessages.val = new Map(nodes); //update
          //}
          break;
        }
      }
    }
    ElRoomInfo.innerText = "";
    closedDelete.val =true;
    //refreshGroupMessages();
  }

  //input public key input
  //need check for admin
  van.derive(async ()=>{
    //console.log(groupID.val);
    const gun = gunState.val;
    const user = gun.user();
    
    if(typeof groupID.val === 'string' && groupID.val.length ===0){
      isAdmin.val = false;
      return;
    }
    ElRoomInfo.innerText = "";
    //console.log("ROOM ID:: ",groupID.val)
    const room = gun.user(groupID.val);
    //console.log("USER room:", room)
    const roomData = await room.then();
    //console.log("roomData: ", roomData);
    if(!roomData?.host){
      //console.log("NO HOST!");
      return;
    }
    let cert_pending = await room.get('certs').get('pending').then();
    //console.log("cert_pending: ",cert_pending);
    let expireDate = "Not Set!";
    if(cert_pending){
      let timeexp = parseInt(cert_pending.split(",")[1].split(":")[1]);
      //console.log("TIME: ", timeexp);
      //console.log("TIME: ", gunUnixToDate(timeexp));
      expireDate = gunUnixToDate(timeexp);
    }

    let alias_obj = await room.get('host').then();
    let alias_keys = Object.keys(alias_obj);
    let pub = "";
    for(let i = 0;i < alias_keys.length;++i){
      if(Gun.SEA.opt.pub("~"+alias_keys[i])){
        pub = alias_keys[i];
        break;
      }
    }
    let owner = await gun.user(pub).then();
    //console.log(owner);
    if(!owner.alias){
      //console.log("Can't find Alias Name!");
      return;
    }
    let pending = "";
    if(pub == user._.sea.pub){
      pending = "Admin";
      isAdmin.val = true;
    }else{
      isAdmin.val = false;
      pending = await room.get("pending").get(user._.sea.pub);
      if(!pending){
        pending = "Not Register";
      }
    }
    //console.log(pending);

    van.add(ElRoomInfo, ElGroupInfo({
      alias:roomData.alias,
      pub: groupID.val,
      host: owner.alias,
      pending:pending,
      expire:expireDate
    }))
  });

  async function copyGroupMessageID(){
    try {
      await navigator.clipboard.writeText(groupID.val);
      board.show({message: "Copy Room ID!", durationSec: 1});
      //console.log('Content copied to clipboard');
    } catch (err) {
      //console.error('Failed to copy: ', err);
      board.show({message: "Fail Copy Room ID!", durationSec: 1});
    }
  }

  //init 
  refreshGroupMessages();

  van.derive(()=>{
    console.log(isLookUp.val);
  })

  return closed.val ? null : div(
    div(
      div(
        button({onclick:()=>navigate('/',{replace:true})},'Back'),
        
      ),
      div(
        button({onclick:()=>isLookUp.val=!isLookUp.val},
          van.derive(()=>{
            if(isLookUp.val){
              return ' Search [x] / List [ ] '
            }else{
              return ' Search [ ] / List [x] '
            }
          })
        )
      ),
      van.derive(()=>{
        if(isLookUp.val){
          return div(
            div(
              input({style:"width:256px;",value:groupID,oninput:e=>groupID.val=e.target.value,placeholder:"Group Message ID Key"}),
            ),
          )
        }else{
          return div(
            div(
              button({onclick:()=>refreshGroupMessages()},'Refresh'),
              label({onclick:()=>copyGroupMessageID()},"Group Messages:"),
            ),
            div(
              GroupMessageSel
            ),
          )
        }
      }),
      div(
        button({onclick:()=>btnJoin()},'Join'),
        button({onclick:()=>btnAddgroupID()},'Add'),
        button({onclick:()=>showConfirmDeleteGroupID()},'Delete'),
        button({onclick:()=>btnShowCreate()},'Create'),
        button({onclick:()=>btnShowOptions()},'Options'),
      ),
      div(
        van.derive(()=>{
          if(isAdmin.val){
            return button({onclick:()=>btnShowAdmin()},'Admin');
          }else{
            return button({disabled:true},'Admin');
          }
        }),
      )
    ),
    ElRoomInfo
  );
}

const ElGroupInfo = ({
  alias,
  host,
  pending,
  pub,
  expire,
})=>{

  async function copyPublicKey(){
    try {
      await navigator.clipboard.writeText(pub);
      board.show({message: "Copy Room ID!", durationSec: 1});
      //console.log('Content copied to clipboard');
    } catch (err) {
      //console.error('Failed to copy: ', err);
      board.show({message: "Fail Copy Room ID!", durationSec: 1});
    }
  }

  async function btnApply(){
    const gun = gunState.val;
    const user = gun.user();
    const room = gun.user(pub);
    const roomData = await room.then();
    //console.log("roomData: ", roomData);
    const cert = await room.get("certs").get('pending').then();
    //console.log("cert: ", cert)
    const _pending = await room.get("pending").get(user._.sea.pub).then();
    //console.log("_pending:", _pending);
    room.get("pending").get(user._.sea.pub).put("apply",
    (ack)=>{
      //console.log(ack);
      if(ack.err){
        board.show({message: ack.err, durationSec: 1});
        return;
      }
      board.show({message: "Alias Apply!", durationSec: 1});
    },{opt:{cert:cert}} )
  }

  return div(
    div(
      label(" Group Message Name: "+alias)
    ),
    div(
      button({onclick:()=>copyPublicKey()}," Public Key: "),
      input({value:pub,readonly:true})
    ),
    div(
      label(" Host: "+ host)
    ),
    div(
      label(" Expire Date: " + expire)
    ),
    div(
      label(" Pending: " + pending)
    ),
    div(
      label("Actions:"),
      button({onclick:()=>btnApply()},"Apply")
    )
  )
};

export {
  ElGroupMessage
}