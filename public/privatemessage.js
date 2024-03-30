/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import { gunUnixToDate, unixTime, unixToDate } from './helper.js';
import { routeTo } from '/vanjs-router.js';
import { isLogin, gunState, aliasState} from '/context.js';
import { Modal, MessageBoard } from "vanjs-ui";
import {van} from '/dps.js';
import { navigate } from "vanjs-routing";

const {
  div, 
  button, input, textarea,
  label,
  table, tbody, tr, td,
  select, option,
} = van.tags;

const ElPrivateMessage = ()=>{

  const userName = van.derive(() => aliasState.val);
  //check user is login if not return to home url
  van.derive(()=>{
    //console.log(isLogin.val);
    if(isLogin.val == false){
      return routeTo('home');
    }
  });

  const view = van.state('message');

  const viewRender = van.derive(()=>{
    if(view.val == 'message'){
      return ElPriaveMessageBox();
    }
    if(view.val == 'compose'){
      return ElPriaveMessageCompose();
    }
    if(view.val == 'options'){
      return ElPriaveMessageBoxOptions();
    }
  });

  return div(
    div(
      button({onclick:()=>navigate('/',{replace:true})},'Back'),
      button({onclick:()=>view.val='message'},' Message '),
      button({onclick:()=>view.val='compose'},' Compose '),
      button({onclick:()=>view.val='options'},' Options '),
      label("Alias:"),
      label(userName),
    ),
    viewRender
  );
}

const ElPriaveMessageBox = ()=>{

  const board = new MessageBoard({top: "20px"})

  const publicKey = van.state('');
  const messages = van.state(new Map());
  const message = van.state('');
  const isAccess = van.state(true);

  //const messageList = div({style:"background-color:lightgray;width:800px;height:400px;overflow: scroll;"});
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
  /*
  van.derive(()=>{
    const messageNodes = messages.val;
    if(messageNodes){
      //console.log(messageNodes);
      messageList.innerText = '';
      for (const [key, messageData] of messageNodes) {
        van.add(messageList, 
          div({id:key},
            label(unixToDate(parseInt(messageData.date))),
            ' > ',
            label(messageData.content)
          )
        );
      }
    }
  })
  */

  function onChangePublicKeys(e){
    messages.val = new Map();
    publicKey.val = e.target.value;
    //console.log(e.target.value);
    //console.log(publicKeys.val)

    const userNodes = new Map(publicKeys.val);
    // ARRAY
    //for(var i = 0; i < userNodes.length; i++ ){
      //if(e.target.value == publicKeys.val[i].pub){
        //aliasNode.innerText = publicKeys.val[i].alias;
        //expireNode.innerText = publicKeys.val[i].cert;
        //break;
      //}
    //}
    
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

  function UpdatePublicMessages(){
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

    //van.add(ElPublicKeys, )
  }

  async function viewMessages(){
    const gun = gunState.val;
    const to = gun.user(publicKey.val);// current user and from 
    let userNode = await to.then();
    //console.log(userNode);
    if(userNode?.alias){
      const user = gun.user();
      console.log("FOUND ALIAS FOR MESSAGE QUERY...");
      const pair = user._.sea;
      let dec = await Gun.SEA.secret(userNode.epub, pair);
      let node = await user.then();
      let currentAlias = node.alias;
      let toAlias = userNode.alias;
      if(!toAlias){
        toAlias="unknown";
      }

      user.get('privatemessage').get(publicKey.val).map().once(async (data,key)=>{ //current user, from select pub
        console.log("data: ",data);
        console.log("key: ",key);

        let content = await Gun.SEA.decrypt(data.content, dec);
        console.log(content);
        if(content){//make sure it not null or empty
          messages.val = new Map(messages.val.set(key,{alias:toAlias,pub:publicKey.val,date:key,content:content }))
        }
      });

      to.get('privatemessage').get(pair.pub).map().once(async (data,key)=>{// from select, current user
        console.log("data: ",data);
        console.log("key: ",key);

        let content = await Gun.SEA.decrypt(data.content, dec);
        console.log(content);
        if(content){//make sure it not null or empty
          messages.val = new Map(messages.val.set(key,{alias:currentAlias,pub:pair.pub,date:key,content:content }))
        }
      });
    }
  }

  async function sendMsg(){
    console.log("SEND!");
    const gun = gunState.val;
    if(gun){
      let timeStamp = Gun.state();
      let gunUser = gun.user();
      let pkey = await gunUser.get('pub');
      console.log('pkey:',pkey)
      
      let to = gun.user(publicKey.val);//get alias
      let who = await to.then() || {};//get alias data
      if(!who.alias){console.log("No Alias!");return;}
      const cert = await to.get('certs').get('privatemessage').then();
      console.log(cert);

      let sec = await Gun.SEA.secret(who.epub, gunUser._.sea); // Diffie-Hellman
      let enc_content = await Gun.SEA.encrypt(message.val, sec); //encrypt message
      //let enc_subject = await gun.SEA.encrypt(subject, sec); //encrypt message
      //console.log("enc.....");
      //console.log(enc);

      //console.log("sec.....");
      //console.log(sec)
      await gun.get('~'+publicKey.val) 
        .get('privatemessage')
        .get(pkey)
        .get(timeStamp).put({
          content:enc_content
        },ack=>{
          console.log(ack);
          if(ack.err){
            console.log('ERROR GUN PUT...');
            //sentStatus.innerText = "Error | Cert Fail!";
            board.show({message: "Cert Fail!", durationSec: 1});
            return;
          }
          console.log('Gun Message Put...');
          //sentStatus.innerText = "Put | Cert Pass!";
          board.show({message: "Cert Pass!", durationSec: 1});
        },{opt:{cert:cert}});

    }else{
      console.log('gun error...');
    }
  }

  function toggleScroll(){

  }

  const scrollToBottom = (id) => {
    const element = document.getElementById(id);
    //console.log(element);
    if(element){
      //console.log("move?")
      element.scrollTop = element.scrollHeight;
    }
  }
  //https://stackoverflow.com/questions/11715646/scroll-automatically-to-the-bottom-of-the-page
  function messageScrollBar(){
    scrollToBottom("chatmessage");
  }

  van.derive(()=>{
    const messageNodes = messages.val;
    setTimeout(()=>{
      messageScrollBar();
    },100);
  });
  //nope await display promise
  const displayAlias = async ({id})=>{
    const gun = gunState.val;
    if(gun){
      let gunUser = gun.user(id);
      let who = await gunUser.then();
      console.log(who);
      if(who.alias){
        label(who.alias);
      }
    }
    return label("DNONE");
  }

  return div(
    div(
      label('Public Alias:'),
      ElPublicKeys,
      button({onclick:()=>UpdatePublicMessages()},'Refresh'),
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

const ElPriaveMessageCompose = ()=>{

  const publicKey = van.state('');
  const message = van.state('');
  const publicKeyStatus = label('None');
  const certStatus = label('None');
  const sentStatus = label('None');
  //const isAccess = label(true);

  // test VKWYPbLiFjKKqqqoUBIkjWmxUKVFK2qELxbzMxehhRA.CSs3ZpdSZfKzogwYq2SjFwbHQ2MSCnu7jnE7iiPABws
  // aaaa 
  async function btnSend(){
    console.log('publicKey: ',publicKey.val);
    console.log('message: ',message.val);
    const gun = gunState.val;
    if(gun){
      let timeStamp = unixTime();
      let gunUser = gun.user();
      let pkey = await gunUser.get('pub');
      console.log('pkey:',pkey)
      
      let to = gun.user(publicKey.val);//get alias
      let who = await to.then() || {};//get alias data
      if(!who.alias){console.log("No Alias!");return;}
      const cert = await to.get('certs').get('privatemessage').then();
      console.log(cert);

      let sec = await Gun.SEA.secret(who.epub, gunUser._.sea); // Diffie-Hellman
      let enc_content = await Gun.SEA.encrypt(message.val, sec); //encrypt message
      //let enc_subject = await gun.SEA.encrypt(subject, sec); //encrypt message
      //console.log("enc.....");
      //console.log(enc);

      //console.log("sec.....");
      //console.log(sec)
      await gun.get('~'+publicKey.val) 
        .get('privatemessage')
        .get(pkey)
        .get(timeStamp).put({
          content:enc_content
        },ack=>{
          console.log(ack);
          if(ack.err){
            console.log('ERROR GUN PUT...');
            sentStatus.innerText = "Error | Cert Fail!";
            return;
          }
          console.log('Gun Message Put...');
          sentStatus.innerText = "Put | Cert Pass!";
        },{opt:{cert:cert}});

    }else{
      console.log('gun error...');
    }
  }

  async function btnCheckCert(){
    console.log("CERT KEY");
    if(publicKey.val != ""){
      const gun = gunState.val;
      let to = gun.user(publicKey.val);//get alias
      let who = await to.then() || {};//get alias data
      if(!who.alias){console.log("No Alias!");return;}
      const cert = await to.get('certs').get('privatemessage').then();
      if(cert){
        //console.log(cert);
        let timeexp = parseInt(cert.split(",")[1].split(":")[1]);
        console.log(gunUnixToDate(timeexp));
        //console.log(JSON.parse(cert));
      }
    }
  }

  async function checkPublicKey(){
    console.log(publicKey.val);
    if(publicKey.val != ""){
      const gun = gunState.val;
      const user = gun.user(publicKey.val)
      let alias = await user.get('alias').then();
      //let alias = "";
      if(alias){
        console.log("alias: ",alias);
        publicKeyStatus.innerText = ""+alias;

        const cert = await user.get('certs').get('privatemessage').then();
        if(cert){
          let timeexp = parseInt(cert.split(",")[1].split(":")[1]);
          certStatus.innerText = "Expire: " + gunUnixToDate(timeexp);
        }else{
          certStatus.innerText = "None";
        }

        //return label("Status: FOUND "+alias);
        return;
      }
      console.log("alias: ",alias);
      //return label("Status:NOT FOUND ");
      publicKeyStatus.innerText = "None";
      certStatus.innerText = "None";
      return;
    }
    console.log("alias: ");
    //return label("Status: None");
    publicKeyStatus.innerText = "None";
  }

  async function btnDraft(){

  }

  van.derive(checkPublicKey);
  //const publicKeyStatus = van.derive(async ()=>await checkPublicKey());

  return div(
    table(
      tbody(
        tr(
          td(
            label('Public Key:')
          ),
          td(
            input({value:publicKey,oninput:e=>publicKey.val=e.target.value}),
            //publicKeyStatus,
            //button({onclick:()=>btnCheckCert()},'Check Cert')
          )
        ),
        tr(
          td(
            label('Alias: ')
          ),
          td(
            publicKeyStatus
          )
        ),
        tr(
          td(
            label("Cert:")
          ),
          td(
            certStatus
          )
        ),
        tr(
          td({colspan:2},
            label('Message')
          )
        ),
        tr(
          td({colspan:2},
            textarea({style:"width:256px;height:80px", value:message,oninput:e=>message.val=e.target.value})
          )
        ),
        tr(
          td({colspan:2},
            button({onclick:()=>btnSend()},'Send'),
            button({onclick:()=>btnDraft()},'Draft')
          )
        ), 
        tr(
          td(
            label('Send Status:')
          ),
          td(
            sentStatus
          )
        )
      )
    )
  );
}

const ElPriaveMessageBoxOptions = ()=>{
  const numDays = van.state(0);
  const numMinutes = van.state(0);
  const numSeconds = van.state(0);
  const numExpire = van.state(0);
  const numExpireDate = label('0');

  const currentExpireDate = label('Not Checked!');

  function getCurrentExpireDate(){
    const gun = gunState.val;
    gun.user()
    .get('certs')
    .get('privatemessage').once((data,key)=>{
      console.log("data: ", data);
      //console.log("key: ", key);
      if(data){
        let timeexp = parseInt(data.split(",")[1].split(":")[1]);
        //console.log(gunUnixToDate(timeexp));
        currentExpireDate.innerText = gunUnixToDate(timeexp);
      }
      
    })
  }


  van.derive(()=>{
    let expireDate = 0;
    if(numDays.val > 0){
      expireDate = expireDate + (60*60*24*numDays.val);
    }
    if(numMinutes.val > 0){
      expireDate = expireDate + (60*60*numMinutes.val);
    }
    if(numSeconds.val > 0){
      expireDate = expireDate +  (60*numSeconds.val);
    }
    expireDate =Gun.state() + (expireDate * 1000);
    numExpire.val = expireDate;
    numExpireDate.innerText = gunUnixToDate(expireDate);
  })

  async function btnOneDayCert(){
    const gun = gunState.val;
    const user = gun.user();
    //console.log(gun);
    //console.log(Gun.SEA);
                     //current time,  seconds, minutes, hours, mini seconds
    let expireTime = Gun.state() + (60*60*24*1000);
    //expireTime = Gun.state() + (60*1000);

    const cert = await Gun.SEA.certify( 
      '*',  // everybody is allowed to write
      { '*':'privatemessage', '+': '*' }, // to the path that starts with 'profile' and along with the key has the user's pub in it
      //room, //authority
      user._.sea, //authority
      null, //no need for callback here
      //{ expiry: Gun.state() + (60*60*24*1000) } // Let's set a one day expiration period
      { expiry: expireTime }
    );

    gun.user()
    .get('certs')
    .get('privatemessage')
    .put(cert);
  }

  async function btnSetExpireDateCert(){
    const gun = gunState.val;
    const user = gun.user();

    const cert = await Gun.SEA.certify( 
      '*',  // everybody is allowed to write
      { '*':'privatemessage', '+': '*' }, // to the path that starts with 'profile' and along with the key has the user's pub in it
      user._.sea, //authority
      null, //no need for callback here
      { expiry: numExpire.val }
    );

    gun.user()
    .get('certs')
    .get('privatemessage')
    .put(cert);

    console.log(numExpire.val);
  }

  return div(
    div(
      label('Never let day more than 30 days else the graph node is ruin.'),
    ),
    div(
      button({onclick:()=>getCurrentExpireDate()},'Current Expire Date:'),
      ' ',
      currentExpireDate
    ),
    div(
      button({onclick:()=>btnOneDayCert()},' 1 Day Certify ')
    ),
    div(
      label('Day:'),
      input({type:'number',value:numDays,oninput:e=>numDays.val=e.target.value, min:0, max:60}),
      label('Minutes:'),
      input({type:'number',value:numMinutes,oninput:e=>numMinutes.val=e.target.value,min:0, max:60}),
      label('Seconds:'),
      input({type:'number',value:numSeconds,oninput:e=>numSeconds.val=e.target.value,min:0, max:60}),
      button({onclick:()=>btnSetExpireDateCert()},'Set Certify'),
      label(' Expire Date: '),
      numExpireDate
    )
  );
}

// user own contacts
const ELAliasPrivateContacts =()=>{

}

export {
  ElPrivateMessage
}