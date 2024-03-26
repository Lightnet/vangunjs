// for public and private group message

import {van} from '/dps.js';
import { Modal } from 'vanjs-ui'; //modal
const {
  button,
  div, 
  label,
  select,
  option,
  input,
  p
} = van.tags;

import { 
  gunState
} from '/context.js';
import { routeTo } from '/vanjs-router.js';
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
  const closed = van.state(false);//create group
  const closedOptions = van.state(false);//create group

  const groupName = van.state('');
  const groupInfo = van.state('None');
  const groupID = van.state('');
  const GroupMessageSel = select({style:"width:256px;",onclick:onChangeGroupMessageSel,onchange:onChangeGroupMessageSel});
  const groupMessages = van.state(new Map());
  const isModalCreate = van.state(true);
  const ElRoomInfo = div();


  function onChangeGroupMessageSel(e){
    //console.log(e.target.value)
    //groupID.val = e.target.value;
    let groupData = groupMessages.val.get(e.target.value);
    if(groupData){
      groupID.val = groupData.pub;
    }
  }

  van.derive(()=>{
    const nodes = groupMessages.val;
    //console.log(nodes);
    //if(nodes.size > 0){
      GroupMessageSel.innerText = '';
      van.add(GroupMessageSel, option({disable:true},'Select Group Message'));
      for(const [key, groupData] of nodes){
        if(groupData != "null"){
          //console.log("key: ",key);
          van.add(GroupMessageSel, option({value:key},groupData.name));
        }
      }
    //}
  })

  function btnJoin(){
    //api({action:"join", groupID:groupID.val})
    if(typeof groupID.val === 'string' && groupID.val.length != 0 ){
      routeTo('groupmessageroom', [groupID.val]);
      closed.val = true;
    }
  }

  function btnShowOptions(){
    van.add(document.body, Modal({closed},
      ElGroupMessageOptions({closed}),
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

    let sec = await Gun.SEA.secret(userPair.pub,userPair)//default?

    let roomData ={
      pub:roomPair.pub,
      name:groupName.val,
      key:roomPair
    }

    let encode = await Gun.SEA.encrypt(roomData,sec);
    //console.log(encode);
    const random_id = String.random(16);
    user.get("groupmessage").get(random_id).put(encode);

    // Issue the wildcard certificate for all to write personal items to the 'profile'
    const cert_message = await Gun.SEA.certify( 
      '*',  // everybody is allowed to write
      { '*':'message', '+': '*' }, // to the path that starts with 'message' and along with the key has the user's pub in it
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
       // Put the certificate into the room graph for ease of later use
      gunInstance.user()
          .get('certs')
          .get('message')
          .put(cert_message);
      gunInstance.user()
          .get('certs')
          .get('pending')
          .put(cert_pending);
      let enc = await SEA.encrypt(roomPair, userPair)
      gunInstance.user()
        .get('host')
        .get(userPair.pub)
        .put(enc);//store room host pub sea pair.
      gunInstance.user()//for user register access
        .get('pending')
        .get(userPair.pub)
        .put("true");

      gunInstance.user()
        .get('members')
        .get(userPair.pub)
        .put({role:"admin"});

      //not safe
      gunInstance.user().get('alias').put(groupName.val);
      
      gunInstance.user().get('information').put(groupInfo.val);
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
    user.get("groupmessage").map().once(async (data,key)=>{
      //console.log("data: ",data)
      if (data == "null"){return;}
      if(data){
        let sec = await SEA.secret(userPair.pub,userPair)//default?
        let decode = await SEA.decrypt(data,sec);
        //console.log("decode: ", decode)
        if(decode){
          groupMessages.val = new Map(groupMessages.val.set(key, decode));
          //setRooms(state=>[...state,decode])
          //console.log(groupMessages.val);
        }
      }
    })

  }

  function btnAddgroupID(){
    const gun = gunState.val;
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

          user.get("groupmessage").get(key).put("null");
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

  van.derive(async ()=>{
    //console.log(groupID.val);
    const gun = gunState.val;
    if(typeof groupID.val === 'string' && groupID.val.length ===0){
      return;
    }
    ElRoomInfo.innerText = "";
    let user = gun.user(groupID.val);
    let room = await user.then();
    console.log(room);
    let alias_pub = await user.get('host').then();
    console.log(alias_pub);
    van.add(ElRoomInfo, ElGroupInfo({
      alias:room.alias,
      pub: room.pub,
      host: alias_pub,
      pending:"None",
    }))
  });

  return closed.val ? null : div(
    div(
      button({onclick:()=>refreshGroupMessages()},'Refresh'),
      label("Group Message Pub:"),
      GroupMessageSel,
      input({value:groupID,oninput:e=>groupID.val=e.target.value,placeholder:"Room ID Key"}),
      button({onclick:()=>btnJoin()},'Join'),
      button({onclick:()=>btnAddgroupID()},'Add'),
      button({onclick:()=>btnDeletegroupID()},'Delete'),
      button({onclick:()=>btnShowCreate()},'Create'),
      button({onclick:()=>btnShowOptions()},'Options'),
    ),
    ElRoomInfo
  );
}

const ElGroupInfo = ({
  alias,
  host,
  pending,
  pub,
})=>{

  return div(
    div(
      label("Group Name: "+alias)
    ),
    div(
      label("Public Key: " + pub)
    ),
    div(
      label("Host:"+ host)
    ),
    div(
      label("Pending:" + pending)
    )
  )
};

//check for current group access and information.
const ElGroupMessageOptions = ({closed})=>{

  const view = van.state();

  return div({style:"width:800px;height:400px;"},
    div(
      button({onclick:()=>closed.val=true},'X')
    ),
    div(
      button('Information'),
      button('Members'),
      button('Blacklist'),
      button('Keys'),
    )
  )
}


const ELGroupMessageRoom =({api,groupID})=>{
  const closed = van.state(false);//this will clean up I think.
  const messages = van.state(new Map());
  const ElMessages = div({style:"backgroud-color:gray; with:600px;height:400px;"});
  const _groupID = van.state('');
  const message = van.state('');

  //console.log("groupID:", groupID)
  //console.log("groupID:", groupID)
  van.derive(()=>{
    //console.log("groupID:", groupID);
    _groupID.val = groupID;
  });

  van.derive(()=>{
    let id = _groupID.val;
    if(typeof id === 'string' && id.length > 0){
      console.log("id: ",id);
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
      routeTo('groupmessage');
      closed.val = true;
    }
  }

  async function initGroupMessage(){
    //console.log("init :", _groupID.val);

    const gun = gunState.val;
    const user = gun.user();
    console.log(user);
    if(!user.is){
      console.log("user.is", user.is);
      return;
    }
    let userPair = user._.sea;
    if(!userPair){
      console.log("userPair", userPair);
      return;
    }

    const room = gun.user(_groupID.val);
    let who = await room.then() || {};//get alias data
    //console.log("room Data: ",who);
    if(!who.certs){console.log("No certs!");return;}
    let dec = await Gun.SEA.secret(who.epub, userPair);
    //const cert = await room.get('certs').get('message').then();

    room.get('message').get(userPair.pub).map().once(async (data,key)=>{
      //console.log("data: ", data);
      //console.log("key: ", key);
      let content = await Gun.SEA.decrypt(data.content, dec);
      console.log("content: ",content);
      if(content){//check if exist
        messages.val = new Map(messages.val.set(key, {content:content}))
      }
      
    });
  }

  async function sentMessage(){
    const gun = gunState.val;
    const user = gun.user();
    let userPair = user._.sea;
    //console.log("_groupID.val: ", _groupID.val);
    const room = gun.user(_groupID.val);

    let who = await room.then() || {};//get alias data
    //console.log("room Data: ",who);
    if(!who.certs){console.log("No certs!");return;}
    const cert = await room.get('certs').get('message').then();

    //need to rework the build later...
    let sec = await Gun.SEA.secret(who.epub, userPair); // Diffie-Hellman
    let enc_content = await Gun.SEA.encrypt(message.val, sec); //encrypt message

    room.get('message').get(userPair.pub).get(Gun.state()).put({
      content:enc_content
    },(ack)=>{
      console.log(ack);
    },{opt:{cert:cert}})
  }

  //initGroupMessage();

  function btnGetInfo(){
    console.log(groupID)
  }

  return closed.val ? null : div(
    div(
      button({onclick:()=>callLeave()},'Leave'),
      label("Room ID:"),
      label(_groupID.val),
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