// for public and private group message

import {van} from '/dps.js';
import '/van-ui.nomodule.min.js'; //modal
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
  isLogin,
  aliasState,
  gunState,
  publicKeyState
} from '/context.js';

//console.log(Modal);

const ElGroupMessage = ()=>{
  const closed = van.state(true);
  const view = van.state('lobby');

  const groupID = van.state('');

  function callAPI(data){
    console.log(data)
    if(data?.action=='join'){
      console.log(data.groupID);
      groupID.val = data.groupID;
      view.val = 'room';
    }
    if(data?.action=='leave'){
      view.val = 'lobby';
    }
  }

  const viewRender = van.derive(()=>{
    if(view.val == 'lobby'){
      return ELGroupMessageMenu({api:callAPI});
    }
    if(view.val == 'room'){
      return ELGroupMessageRoom({api:callAPI,groupID:groupID.val});
    }
  })

  van.add(document.body, Modal({closed},
    p("Hello, World!"),
    div({style: "display: flex; justify-content: center;"},
      button({onclick: () => closed.val = true}, "Ok"),
    ),
  ));


  return div(
    viewRender
  );
}

const ELGroupMessageMenu =({api})=>{
  //const closed = van.state(true);
  const GroupName = van.state('');
  const GroupID = van.state('');
  const GroupMessageSel = select({style:"width:256px;",onchange:onChangeGroupMessageSel});
  const groupMessages = van.state(new Map());

  const isModalCreate = van.state(true);

  function onChangeGroupMessageSel(e){
    console.log(e.target.value)
    //GroupID.val = e.target.value;
    let groupData = groupMessages.val.get(e.target.value);
    if(groupData){
      GroupID.val = groupData.pub;
    }
  }

  van.derive(()=>{
    const nodes = groupMessages.val;
    console.log(nodes);
    if(nodes.size > 0){
      GroupMessageSel.innerText = '';
      van.add(GroupMessageSel, option({disable:true},'Select Group Message'));
      for(const [key, groupData] of nodes){
        van.add(GroupMessageSel, option({value:key},groupData.name));
      }
    }
  })

  function btnJoin(){
    api({action:"join", groupID:GroupID.val})
  }

  function btnShowOptions(){

  }

  function btnCreate(){
    console.log("create???")
    isModalCreate.val = true
    console.log(GroupName.val);
    createGroupMessage();
  }

  function btnShowCreate(){
    console.log("show create")
    isModalCreate.val = false;
    van.add(document.body, Modal({closed:isModalCreate},
      p("Create Group Message!"),
      input({value:GroupName, oninput:e=>GroupName.val=e.target.value}),
      div({style: "display: flex; justify-content: center;"},
        button({onclick:()=>btnCreate()}, "Ok"),
        button({onclick:()=>isModalCreate.val=true}, "Cancel")
      ),
    ));
  }

  async function createGroupMessage(){
    const gun = gunState.val;

    let roomPair = await Gun.SEA.pair()
    console.log(roomPair)
    let user = gun.user();
    //console.log(user)
    console.log(user._.sea)
    let userPair = user._.sea;

    let sec = await Gun.SEA.secret(userPair.pub,userPair)//default?
    console.log(sec)
    let uuid = String.random(16);
    let roomData ={
      pub:roomPair.pub,
      name:uuid || GroupName.val,
      key:roomPair
    }

    let encode = await Gun.SEA.encrypt(roomData,sec);
    console.log(encode);

    user.get("groupmessage").get(uuid).put(encode);

    // Issue the wildcard certificate for all to write personal items to the 'profile'
    const cert = await Gun.SEA.certify( 
      '*',  // everybody is allowed to write
      { '*':'message', '+': '*' }, // to the path that starts with 'profile' and along with the key has the user's pub in it
      roomPair, //authority
      null, //no need for callback here
      { expiry: Gun.state() + (60*60*24*1000) } // Let's set a one day expiration period
    );

    const gunInstance = Gun(location.origin+"/gun");
    // https://gun.eco/docs/SEA.certify

    /*
    gunInstance.user().create(roomPair, () => {
      gunInstance.user()
        .get('certs')
        .get('message')
        .put(cert);
    });
    */

    // Authenticate with the room pair
    
    gunInstance.user().auth(roomPair, () => { 
       // Put the certificate into the room graph for ease of later use
       gunInstance.user()
          .get('certs')
          .get('message')
          .put(cert);
      //not safe
      gunInstance.user().get('alias').put(roomPair.pub)
      gunInstance.user().get('pub').put(roomPair.pub)
      gunInstance.user().get('epub').put(roomPair.epub)
    });
  }

  async function refreshGroupMessages(){
    //GroupMessageSel.innerText = '';
    const gun = gunState.val;
    const user = gun.user();
    let userPair = user._.sea;
    user.get("groupmessage").map().once(async (data,key)=>{
      //console.log("data: ",data)
      if(data){
        let sec = await SEA.secret(userPair.pub,userPair)//default?
        let decode = await SEA.decrypt(data,sec);
        //console.log("decode: ", decode)
        if(decode){
          groupMessages.val = new Map(groupMessages.val.set(decode.name, decode));
          //setRooms(state=>[...state,decode])
        }
      }
    })

  }

  return div(
    div(
      button({onclick:()=>refreshGroupMessages()},'refresh'),
      label("Group Keys:"),
      GroupMessageSel,
      input({value:GroupID,oninput:e=>GroupID.val=e.target.value}),
      button({onclick:()=>btnJoin()},'Join'),
      button('Add'),
      button('Delete'),
      button({onclick:()=>btnShowCreate()},'Create'),
      button({onclick:()=>btnShowOptions()},'Options')
    )
  );
}

const ELGroupMessageRoom =({api,groupID})=>{

  console.log("groupID:", groupID)

  const messages = van.state(new Map());
  const ElMessages = div({style:"backgroud-color:gray; with:600px;height:400px;"});
  const _groupID = van.state('');
  const message = van.state('');

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
    api({action:'leave'})
  }

  async function initGroupMessage(){
    console.log("init :", groupID);
    _groupID.val = groupID;
    

    const gun = gunState.val;
    const user = gun.user();
    let userPair = user._.sea;

    const room = gun.user(groupID);
    let who = await room.then() || {};//get alias data
    console.log("room Data: ",who);
    if(!who.certs){console.log("No certs!");return;}
    let dec = await Gun.SEA.secret(who.epub, userPair);
    //const cert = await room.get('certs').get('message').then();

    room.get('message').get(userPair.pub).map().once(async (data,key)=>{
      console.log("data: ", data);
      console.log("key: ", key);
      let content = await Gun.SEA.decrypt(data.content, dec);
      console.log("content: ",content);
      messages.val = new Map(messages.val.set(key, {content:content}))
    });
  }

  initGroupMessage();

  async function sentMessage(){
    const gun = gunState.val;
    const user = gun.user();
    let userPair = user._.sea;
    console.log("_groupID.val: ", _groupID.val);
    const room = gun.user(_groupID.val);

    let who = await room.then() || {};//get alias data
    console.log("room Data: ",who);
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

  return div(
    div(
      label("Public Key:"),
      label(_groupID.val),
      button({onclick:()=>callLeave()},'Leave'),
    ),
    ElMessages,
    div(
      input({valueL:message,oninput:e=>message.val=e.target.value}),
      button({onclick:()=>sentMessage()},'Sent')  
    )
  )
}


export {
  ElGroupMessage
}