/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import van from 'van';
import { board, gunState } from '../context.js';
import { gunUnixToDate, unixToDate } from '../../libs/helper.js';

const { div, button, input, textarea, label, table, tbody, tr, td, select, option } = van.tags;

const PrivateMessageInbox = ()=>{
  
  const publicKey = van.state('');
  const messages = van.state(new Map());
  const message = van.state('');
  const isAccess = van.state(true);
  const publicKeys = van.state(new Map());
  const aliasNode = label('None');
  const expireNode = label('None');
  const ElPublicKeys = select({style:"width:200px;",onclick:(e)=>onChangePublicKeys(e),onchange:(e)=>onChangePublicKeys(e)})

  function clickSelect(e){
    console.log("clickSelect: ",e.target.value);
  }

  van.derive(()=>{
    const userNodes = publicKeys.val;
    //console.log(userNodes);
    if(userNodes){
      ElPublicKeys.innerText = '';
      van.add(ElPublicKeys, option({disabled:true},'Select Alias'));
      for (const [key, userData] of userNodes) {
        //console.log(`${key} = ${userData}`);
        //console.log(userData);
        van.add(ElPublicKeys, option({value:key,onclick:()=>clickSelect(key)},userData.alias));
      }
    }
  });

  function onChangePublicKeys(e){
    messages.val = new Map();
    publicKey.val = e.target.value;
    //console.log(e.target.value);
    //console.log(publicKeys.val)
    const userNodes = new Map(publicKeys.val);
    // MAP
    let userData = userNodes.get(e.target.value);//public key
    if(userData){//user {alias:userNode.alias,pub:id,cert:certdata};
      //console.log("on Change userData: ",userData);
      aliasNode.innerText = userData.alias;
      expireNode.innerText = gunUnixToDate(parseInt(userData.cert)) + " > " + gunUnixToDate(Gun.state());
      //console.log(typeof expireNode.innerText);
      //console.log(expireNode.innerText);
      if(userData.cert != "None"){
        //console.log(userData.cert);
        if(parseInt(userData.cert) > Gun.state()){//if expire disable UI
          isAccess.val = true;
        }else{
          isAccess.val = false;
        }
      }else{
        isAccess.val = false;
      }
    }
  }
  //https://github.com/vanjs-org/van/discussions/220
  function getMessagesPublicKeys(){
    const gun = gunState.val;
    const user = gun.user();
    //console.log(user)
    ElPublicKeys.innerText = '';
    van.add(ElPublicKeys, option({value:''},'Select Alias'));
    if(user.is){
      user.get('privatemessage').map().once( async (data,id)=>{
        //console.log("=====>");
        //console.log("user",data);
        //console.log("id",id);
        //console.log(Gun.SEA.opt);
        //console.log(Gun.SEA.opt.pub(id));//will not work, work on "~key" or "@key"
        let _user = gun.user(id);
        let userNode = await _user.then();//graph node
        //console.log(userNode);
        if(userNode.alias != null){
          //console.log("userNode.alias:", userNode.alias);
          const cert = await _user.get('certs').get('privatemessage').then();
          let certdata = "None";
          if(cert){
            //console.log(cert);
            let timeexp = parseInt(cert.split(",")[1].split(":")[1]);
            certdata = timeexp;
          }
          //make sure there no same id key
          publicKeys.val = new Map(publicKeys.val.set(id, {
            alias:userNode.alias,
            pub:id,
            cert:certdata
          }));
        }
      });
    }
  }

  async function viewMessages(){
    const gun = gunState.val;
    const to = gun.user(publicKey.val);// current user and from 
    let userNode = await to.then();
    //console.log(userNode);
    if(userNode?.alias){
      const user = gun.user();
      //console.log("FOUND ALIAS FOR MESSAGE QUERY...");
      const pair = user._.sea;
      let dec = await Gun.SEA.secret(userNode.epub, pair);
      let node = await user.then();
      let currentAlias = node.alias;
      let toAlias = userNode.alias;

      user.get('privatemessage').get(publicKey.val).map().once(async (data,key)=>{ //current user, from select pub
        //console.log("data: ",data);
        //console.log("key: ",key);
        let content = await Gun.SEA.decrypt(data.content, dec);
        //console.log(content);
        if(content){//make sure it not null or empty
          messages.val = new Map(messages.val.set(key,{alias:toAlias,pub:publicKey.val,date:key,content:content }))
        }
      });

      to.get('privatemessage').get(pair.pub).map().once(async (data,key)=>{// from select, current user
        //console.log("data: ",data);
        //console.log("key: ",key);
        let content = await Gun.SEA.decrypt(data.content, dec);
        //console.log(content);
        if(content){//make sure it not null or empty
          messages.val = new Map(messages.val.set(key,{alias:currentAlias,pub:pair.pub,date:key,content:content }))
        }
      });
    }
  }
  //sent message
  async function sendMsg(){
    //console.log("SEND!");
    const gun = gunState.val;
    if(gun){
      let timeStamp = Gun.state();
      let gunUser = gun.user();
      let pkey = await gunUser.get('pub');
      //console.log('pkey:',pkey)
      
      let to = gun.user(publicKey.val);//get alias
      let who = await to.then() || {};//get alias data
      if(!who.alias){console.log("No Alias!");return;}
      const cert = await to.get('certs').get('privatemessage').then();
      //console.log(cert);

      let sec = await Gun.SEA.secret(who.epub, gunUser._.sea); // Diffie-Hellman
      let enc_content = await Gun.SEA.encrypt(message.val, sec); //encrypt message
      //let enc_subject = await gun.SEA.encrypt(subject, sec); //encrypt message
      //console.log("enc.....");
      //console.log(enc);

      await gun.get('~'+publicKey.val) 
        .get('privatemessage')
        .get(pkey)
        .get(timeStamp).put({
          content:enc_content
        },ack=>{
          //console.log(ack);
          if(ack.err){
            //console.log('ERROR GUN PUT...');
            //sentStatus.innerText = "Error | Cert Fail!";
            board.show({message: "Cert Fail!", durationSec: 1});
            return;
          }
          //console.log('Gun Message Put...');
          //sentStatus.innerText = "Put | Cert Pass!";
          board.show({message: "Cert Pass!", durationSec: 1});
        },{opt:{cert:cert}});

    }else{
      //console.log('gun error...');
    }
  }

  function toggleScroll(){

  }

  const scrollToBottom = (id) => {
    const element = document.getElementById(id);
    //console.log(element);
    if(element){//check if div or other elemenent exist id
      //console.log("move?")
      element.scrollTop = element.scrollHeight;
    }
  }
  //https://stackoverflow.com/questions/11715646/scroll-automatically-to-the-bottom-of-the-page
  function messageScrollBar(){
    scrollToBottom("chatmessage");
  }

  van.derive(()=>{
    const _messageNodes = messages.val;
    setTimeout(()=>{
      messageScrollBar();
    },100);
  });

  getMessagesPublicKeys();

  return div(
    div(
      label('Public Alias:'),
      ElPublicKeys,
      button({onclick:()=>getMessagesPublicKeys()},'Refresh'),
      input({value:publicKey,oninput:e=>publicKey.val=e.target.value})
    ),
    div(
      label('Alias:'),aliasNode
    ),
    div(
      label('Certify Expire:'),expireNode
    ),
    div(
      button({onclick:()=>viewMessages()},'View Message')
    ),
    //messageList,
    van.derive(()=>{
      const messageNodes = messages.val;
      //console.log( messageNodes);
      let messageList = [];
      //https://www.geeksforgeeks.org/how-to-convert-map-keys-to-an-array-in-javascript/
      messageNodes.forEach((data, key) => {
        messageList.push(
        div({id:key},
        label(unixToDate(parseInt(data.date))),
        label(" : "),
        label(data.alias),
        label(" :> "),
        label(data.content),
        ));
      });
      // setTimeout(()=>{
      //   messageScrollBar();
      // },500);
      //console.log(messageList);
      return div({id:"chatmessage",style:"background-color:lightgray;width:800px;height:400px;overflow: scroll;"},
        messageList
      );
    }),
    van.derive(()=>{
      if(isAccess.val){
        return div(
          input({value:message,oninput:e=>message.val=e.target.value}),
          button({onclick:()=>sendMsg()},'Send'),
          button({onclick:()=>toggleScroll()},'Auto Scroll'),
        )
      }else{
        return ' ';
      }
    }),
  );
}

export {
  PrivateMessageInbox
}