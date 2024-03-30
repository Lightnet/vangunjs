/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

// for group message
// https://github.com/Lightnet/jsvuegunui/blob/main/src/components/groupmessage/GroupMessage.vue

import { 
  navigate, 
  getRouterPathname, 
  getRouterParams, 
  getRouterQuery 
} from "vanjs-routing";
import {van} from '/dps.js';
import { Modal } from 'vanjs-ui'; //modal
const {
  button, div, label,
  select, option,
  input,
  p,
  table, tbody, tr, td, thead
} = van.tags;

import { 
  gunState,
  isLogin,
  board
} from '/context.js';
//import { routeTo } from '/vanjs-router.js';
import { gunUnixToDate } from './helper.js';
import { ElDisplayAlias } from './account.js';
//console.log(Modal);

const ElGroupMessage = ()=>{

  const view = van.state('lobby');

  const viewRender = van.derive(()=>{
    if(view.val == 'lobby'){
      return ELGroupMessageMenu();
    }
  })

  return div(
    viewRender
  );
}

const ELGroupMessageMenu =()=>{
  const closed = van.state(false);//create modal
  //const closedOptions = van.state(false);//create group
  const groupName = van.state('');
  const groupInfo = van.state('None');
  const groupID = van.state('');
  const GroupMessageSel = select({style:"width:256px;",onclick:onChangeGroupMessageSel,onchange:onChangeGroupMessageSel});
  const groupMessages = van.state(new Map());
  const isModalCreate = van.state(true);
  const ElRoomInfo = div();
  const isAdmin = van.state(false);

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
      console.log(user.is.pub);
      let member = await roomNode.get('members').get(user.is.pub).then();
      console.log("member: ", member)
      if(member){
        //need to check ban...
        console.log("member: ", member)
      }else{
        board.show({message: "Reject Non Member!", durationSec: 1});
        console.log("Not Member!");
        return;
      }
      //routeTo('groupmessageroom', [groupID.val]);
      board.show({message: "Join Member!", durationSec: 1});
      navigate('/groupmessageroom/'+groupID.val,{replace:true})
      //closed.val = true;
    }
    //console.log("groupID.val: ", groupID.val)
    //navigate('/room?id=yrdy',{replace:true});
    //navigate(`/roomtest`,{replace:true});
  }

  function btnShowOptions(){
    
  }

  function btnShowAdmin(){
    van.add(document.body, Modal({closed},
      ElGroupMessageOptions({closed,roomID:groupID.val}),
    ))
  }

  function btnCreate(){
    //console.log("create???")
    if(typeof groupName.val === 'string' && groupName.val.length === 0){
      console.log("EMPTY!");
      return;
    }
    isModalCreate.val = true
    //console.log(groupName.val);
    createGroupMessage();
  }

  function btnShowCreate(){
    console.log("show create")
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

    // https://gun.eco/docs/SEA.certify
    // Authenticate with the room pair
    gunInstance.user().auth(roomPair, async () => {

      // gunInstance.user()//for user register access
      //   .get('pending')
      //   .get(userPair.pub)
      //   .put("true");

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

      const genSharekey = String.random(16);
      let dh = await SEA.secret(userPair.epub, roomPair);
      const enc_share_key = await SEA.encrypt(genSharekey, dh);

      gunInstance.user()
        .get('keys')
        .get('messages')
        .get(userPair.pub)
        .put(enc_share_key); // ?

      // let passphrase = await SEA.secret(userPair.epub,roomPair);
      // gunInstance.user()
      //   .get('keys')
      //   .get('messages')
      //   .get(userPair.pub)
      //   .put(passphrase); // ?

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
      //not safe ?
      //gunInstance.user().get('pub').put(roomPair.pub)
      //gunInstance.user().get('epub').put(roomPair.epub)
    });
  }

  async function refreshGroupMessages(){
    //GroupMessageSel.innerText = '';
    const gun = gunState.val;
    const user = gun.user();
    let userPair = user._.sea;
    groupMessages.val = new Map();
    user.get("groupmessages").map().once(async (data,key)=>{
      console.log("data: ",data);
      console.log("key: ",key);
      if (data == "null"){return;}
      if(data){
        let sec = await SEA.secret(userPair.pub,userPair) // default?

        let decode = await SEA.decrypt(data,sec);
        console.log("decode: ", decode)
        if(decode){
          groupMessages.val = new Map(groupMessages.val.set(key, decode));
          //setRooms(state=>[...state,decode])
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
      console.log("NO HOST!")
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

  function btnDeletegroupID(){
    console.log(groupID.val);
    const nodes = groupMessages.val;
    for(const [key, groupData] of nodes){
      console.log(groupData);
      if(groupData != "null"){
        if(groupData.pub == groupID.val){
          console.log("FOUND!", groupData);
          console.log("key", key);
          const gun = gunState.val;
          const user = gun.user();

          user.get("groupmessages").get(key).put("null");
          groupID.val = "";
          let messageids = nodes.delete(key);
          console.log(nodes);
          //if(messageids){//bool
            groupMessages.val = new Map(nodes); //update
          //}
          break;
        }
      }
    }
    //refreshGroupMessages();
  }

  //input public key input
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
    console.log("roomData: ", roomData);
    if(!roomData?.host){
      isAdmin.val = false;
      console.log("NO HOST!");
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
    console.log(owner);
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

  return closed.val ? null : div(
    div(
      button({onclick:()=>navigate('/',{replace:true})},'Back'),
      button({onclick:()=>refreshGroupMessages()},'Refresh'),
      label({onclick:()=>copyGroupMessageID()},"Group Messages:"),
      GroupMessageSel,
      input({value:groupID,oninput:e=>groupID.val=e.target.value,placeholder:"Room ID Key"}),
      button({onclick:()=>btnJoin()},'Join'),
      button({onclick:()=>btnAddgroupID()},'Add'),
      button({onclick:()=>btnDeletegroupID()},'Delete'),
      button({onclick:()=>btnShowCreate()},'Create'),
      button({onclick:()=>btnShowOptions()},'Options'),
      van.derive(()=>{
        if(isAdmin.val){
          return button({onclick:()=>btnShowAdmin()},'Admin');
        }else{
          return button({disabled:true},'Admin');
        }
      }),
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
    console.log("roomData: ", roomData);
    const cert = await room.get("certs").get('pending').then();
    console.log("cert: ", cert)
    const _pending = await room.get("pending").get(user._.sea.pub).then();
    console.log("_pending:", _pending);
    room.get("pending").get(user._.sea.pub).put("apply",
    (ack)=>{
      console.log(ack);
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

//check for current group access and information.
const ElGroupMessageOptions = ({closed,roomID})=>{

  const view = van.state("certs");

  const viewRender = van.derive(()=>{

    if(view.val == "certs"){
      return ElCerts({roomID:roomID})
    }
    if(view.val == "members"){
      return ElMembers({roomID:roomID})
    }
    if(view.val == "pending"){
      return ElPending({roomID:roomID})
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

const ElMembers = ({roomID})=>{

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
      console.log("NO HOST");
      return;
    }

    room.get('members').map().once(async (data,key)=>{
      console.log("key:", key)
      console.log("data:", data)
      let to = gun.user(key);
      let who = await to.then();
      if(!who.alias){
        console.log("No Alias!");
        return;
      }
      //use map to prevent same copy over lap
      userRegisters.val = new Map(userRegisters.val.set(key,{alias:who.alias,pub:key,data:data}))
    });
  }

  async function btnGrant(id){
    console.log("id: ",id);
    const gun = gunState.val;

    let to = gun.user(id);
    let who = await to.then();
    if(!who.alias){
      console.log("No Alias!");
      return;
    }
    console.log("who: ", who);

    const user = gun.user();
    const userPair = user._.sea;
    const room = gun.user(groupID.val);
    console.log(user.is.pub)
    console.log(user._.sea)
    const enc_roomPair = await room.get('host').get(user.is.pub).then();
    if(!enc_roomPair){
      console.log("NOT OWNER");
      return;
    }
    console.log(enc_roomPair)
    const roomPair = await Gun.SEA.decrypt(enc_roomPair, user._.sea);
    //instance of gun
    const gunInstance = Gun(location.origin+"/gun");
    //auth to update data node
    gunInstance.user().auth(roomPair, async function(ack){
      //gunInstance.user().get('pending').get(id).put('Rejected');
      let dh = await Gun.SEA.secret(userPair.epub, roomPair);
      //get sharekey
      let enc_shareKey = await gunInstance.user().get('keys').get('messages').get(userPair.pub).then();
      let shareKey = await Gun.SEA.decrypt(enc_shareKey, dh);
      console.log("shareKey: ", shareKey);

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
    console.log("id: ",id);
    console.log("id: ",id);
    const gun = gunState.val;

    let to = gun.user(id);
    let who = await to.then();
    if(!who.alias){
      console.log("No Alias!");
      return;
    }
    console.log("who: ", who);

    const user = gun.user();
    const userPair = user._.sea;
    const room = gun.user(groupID.val);
    console.log(user.is.pub)
    console.log(user._.sea)
    const enc_roomPair = await room.get('host').get(user.is.pub).then();
    if(!enc_roomPair){
      console.log("NOT OWNER");
      return;
    }
    console.log(enc_roomPair)
    const roomPair = await Gun.SEA.decrypt(enc_roomPair, user._.sea);
    //instance of gun
    const gunInstance = Gun(location.origin+"/gun");
    //auth to update data node
    gunInstance.user().auth(roomPair, async function(ack){

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
    console.log(user.is.pub)
    console.log(user._.sea)
    const enc_roomPair = await room.get('host').get(user.is.pub).then();
    if(!enc_roomPair){
      console.log("NOT OWNER");
      return;
    }

    console.log(enc_roomPair)
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
      console.log("shareKey: ", shareKey);

      //
      let genSharekey = String.random(16);
      console.log("genSharekey: ", genSharekey);

      gunInstance.user().get("members").map().once(async (data,key)=>{
        console.log("key:", key)
        console.log("data:", data)
        let to = gun.user(key);
        let who = await to.then();
        //check for ban later...
        if(!who.alias){
          console.log("No Alias!");
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
          userDatas.push(tr(
            td(
              label({},data.alias),
            ),
            td(
              input({value:key,readonly:true}),
            ),

            td(
              button({onclick:()=>btnGrant(key)}," Grant "),
              button({onclick:()=>btnRevoke(key)}," Revoke "),
              button({onclick:()=>btnBan(key)}," Ban "),
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

const ElPending = ({roomID})=>{

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
      console.log("NO HOST");
      return;
    }

    room.get('pending').map().once(async (data,key)=>{
      console.log("key:", key)
      console.log("data:", data)
      let to = gun.user(key);
      let who = await to.then();
      if(!who.alias){
        console.log("No Alias!");
        return;
      }
      //use map to prevent same copy over lap
      userRegisters.val = new Map(userRegisters.val.set(key,{alias:who.alias, pub:key, data:data}))
    });
  }

  async function btnApprove(id){
    console.log("id: ",id);
    const gun = gunState.val;

    let to = gun.user(id);
    let who = await to.then();
    if(!who.alias){
      console.log("No Alias!");
      return;
    }
    console.log("who: ", who);

    const user = gun.user();
    const userPair = user._.sea;
    const room = gun.user(roomID);
    console.log(user.is.pub)
    console.log(user._.sea)
    const enc_roomPair = await room.get('host').get(user.is.pub).then();
    console.log(enc_roomPair)
    const roomPair = await Gun.SEA.decrypt(enc_roomPair, user._.sea);
    //auth to update data node
    const gunInstance = Gun(location.origin+"/gun");
    gunInstance.user().auth(roomPair, async function(ack){
      //gunInstance.user().get('pending').get(id).put('Rejected');
      let dh = await Gun.SEA.secret(userPair.epub, roomPair);
      //get sharekey
      let enc_shareKey = await gunInstance.user().get('keys').get('messages').get(userPair.pub).then();
      let shareKey = await Gun.SEA.decrypt(enc_shareKey, dh);
      console.log("shareKey: ", shareKey);

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

const ElCerts = ({roomID})=>{

  async function btnApplyMessage1Day(){
    console.log("roomID: ", roomID)
    const gun = gunState.val;
    const user = gun.user();
    const room = gun.user(roomID);
    const roomData = await room.then();
    if(!roomData.host){
      console.log("NO HOST");
      return;
    }
    let roomPair = {};
    const userPair = user._.sea;
    console.log("userPair: ", userPair);
    let encRoomPair = await room.get('host').get(userPair.pub).then()
    //encRoomPair
    roomPair = await SEA.decrypt(encRoomPair, userPair);
    console.log("roomPair: ",roomPair);
    if(!roomPair){
      console.log("FAIL ROOM PAIR");
      return;
    }
    let expireTime = Gun.state() + (60*60*25*1000);

    const cert_messages = await Gun.SEA.certify( 
      '*',  // everybody is allowed to write
      { '*':'messages', '+': '*' }, // to the path that starts with 'message' and along with the key has the user's pub in it
      roomPair, //authority
      (ack)=>{
        console.log(ack);
      }, //no need for callback here
      { expiry: expireTime } // Let's set a one day expiration period
    );
    console.log("cert_messages: ", cert_messages)

    const gunInstance = Gun(location.origin+"/gun");
    gunInstance.user().auth(roomPair, async () => {
      gunInstance.user().get('certs')
        .get('messages')
        .put(cert_messages);
    })
  }

  async function btnApplyPending1Day(){
    console.log("roomID: ", roomID)
    const gun = gunState.val;
    const user = gun.user();
    const room = gun.user(roomID);
    const roomData = await room.then();
    if(!roomData.host){
      console.log("NO HOST");
      return;
    }
    let roomPair = {};
    const userPair = user._.sea;
    console.log("userPair: ", userPair);
    let encRoomPair = await room.get('host').get(userPair.pub).then()
    //encRoomPair
    roomPair = await SEA.decrypt(encRoomPair, userPair);
    console.log("roomPair: ",roomPair);
    if(!roomPair){
      console.log("FAIL ROOM PAIR");
      return;
    }
    let expireTime = Gun.state() + (60*60*25*1000);

    console.log(expireTime);
    console.log(
      gunUnixToDate(expireTime)
    )

    const cert_pending = await Gun.SEA.certify( 
      '*',  // everybody is allowed to write
      { '*':'pending', '+': '*' }, // to the path that starts with 'message' and along with the key has the user's pub in it
      roomPair, //authority
      (ack)=>{
        console.log(ack);
      }, //no need for callback here
      { expiry: expireTime } // Let's set a one day expiration period
    );
    console.log("cert_pending: ", cert_pending)

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

const ELGroupMessageRoom =()=>{

  //console.log(getRouterPathname()); // "/home/learning/science"
  //console.log(getRouterParams()); // { section: "learning", topic: "science" }
  //console.log(getRouterQuery()); // { tab: "intro" }  

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
  //const gunNodeMessage = van.state(null);

  van.derive(() => {
    console.log("getRouterPathname: ",getRouterPathname()); // { section: "profile" }
    let id = getRouterPathname().split("/")[2]
    console.log("id: ",id)
    _groupID.val = id;
  });

  // van.derive(() => {
  //   console.log("getRouterParams: ",getRouterParams()); // { section: "profile" }
  // });

  // van.derive(() => {
  //   console.log("getRouterQuery: ",getRouterQuery()); // { section: "profile" }
  // });

  // van.derive(()=>{
  //   //clean up if refresh that still hold render
  //   //check if user is login and if not login it will close to clean up leaking...
  //   if(isLogin.val == false){
  //     closed.val = true;
  //   }
  // });

  //console.log("groupID:", groupID)
  van.derive(()=>{
    //console.log("groupID:", groupID);
    //_groupID.val = groupID;
    let id = _groupID.val;
    //looping call?
    if(typeof id === 'string' && id.length > 0 && isInit.val == false){
      console.log("id: ",id);
      isInit.val = true;
      initGroupMessage();
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
    //if(gunNodeMessage.val){
      //gunNodeMessage.val.off();//turn off listen
    //}

    const gunInstance = Gun(location.origin+"/gun");

    const gun = gunState.val;
    const user = gun.user();
    const userPair = user._.sea;
    gunInstance.user().auth(userPair, async () => {

      console.log(user);
      if(!user.is){
        console.log("user.is", user.is);
        return;
      }
      if(!userPair){
        console.log("userPair", userPair);
        return;
      }

      const room = gunInstance.user(_groupID.val);
      let who = await room.then() || {};//get alias data
      console.log("room Data: ",who);
      //TODO ENCODE
      if(!who.certs){console.log("No certs!");return;}
      //let dec = await Gun.SEA.secret(who.epub, userPair);
      //const cert = await room.get('certs').get('message').then();
      let encsharekey = await room.get('keys').get('messages').get(userPair.pub);
      if(encsharekey==null){
        console.log("encsharekey NULL");
        return;
      }
      console.log(encsharekey);
      let dh = await SEA.secret(who.epub, userPair);
      let _shareKey = await SEA.decrypt(encsharekey, dh);
      console.log("shareKey: ", _shareKey);
      if(_shareKey==null){
        console.log("shareKey NULL");
        return;
      }
      shareKey.val = _shareKey;

      room.get('messages').get(userPair.pub).map().once(async (data,key)=>{
        //console.log("data: ", data);
        //console.log("key: ", key);
        let content = await Gun.SEA.decrypt(data.content, shareKey.val);

        //let content = data.content;
        console.log("content: ",content);
        if(content){//check if exist
          messages.val = new Map(messages.val.set(key, {content:content}))
        }
      });
    });

    //gunNodeMessage.val = room;
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
        console.log(ack);
        if(ack.err){
          board.show({message: ack.err, durationSec: 1});
        }
        
      },{opt:{cert:cert}})
    });

  }

  //initGroupMessage();

  function btnGetInfo(){
    console.log(groupID)
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
        pub = alias_keys[i];
        break;
      }
    }
    let owner = await gun.user(pub).then();
    console.log(owner);
    if(!owner.alias){
      //console.log("Can't find Alias Name!");
      return;
    }
    if(pub == user._.sea.pub){
      isAdmin.val = true;
    }

    console.log(roomData);
    roomName.val = roomData.alias;
  }

  const currentRoomName = van.derive(()=>roomName.val);

  function btnShowAdmin(){
    van.add(document.body, Modal({closed:closedAdmin},
      ElGroupMessageOptions({closed:closedAdmin,roomID:_groupID.val}),
    ))
  }

  //checkGroupMessageInfo();

  //const isClosed = van.derive(()=>closed.val);
  //return isClosed ? null : div({id:_groupID.val},
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
      ElDisplayAlias(),
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
  ElGroupMessage,
  ELGroupMessageRoom
}