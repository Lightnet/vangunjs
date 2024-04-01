/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import van from 'van';
import { gunUnixToDate, unixTime, unixToDate } from '../../libs/helper.js';
import { isLogin, gunState, aliasState} from '../context.js';
import { Modal, MessageBoard } from "vanjs-ui";
import { navigate } from "vanjs-routing";

const { div, button, input, textarea, label, table, tbody, tr, td, select, option } = van.tags;

const PrivateMessageCompose = ()=>{

  const publicKey = van.state('');
  const message = van.state('');
  const publicKeyStatus = label('None');
  const certStatus = label('None');
  const sentStatus = label('None');
  //const isAccess = label(true);

  // test VKWYPbLiFjKKqqqoUBIkjWmxUKVFK2qELxbzMxehhRA.CSs3ZpdSZfKzogwYq2SjFwbHQ2MSCnu7jnE7iiPABws
  // aaaa 
  async function btnSend(){
    //console.log('publicKey: ',publicKey.val);
    //console.log('message: ',message.val);
    const gun = gunState.val;
    if(gun){
      let timeStamp = unixTime();
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

      //console.log("sec.....");
      //console.log(sec)
      await gun.get('~'+publicKey.val) 
        .get('privatemessage')
        .get(pkey)
        .get(timeStamp).put({
          content:enc_content
        },ack=>{
          //console.log(ack);
          if(ack.err){
            //console.log('ERROR GUN PUT...');
            sentStatus.innerText = "Error | Cert Fail!";
            return;
          }
          //console.log('Gun Message Put...');
          sentStatus.innerText = "Put | Cert Pass!";
        },{opt:{cert:cert}});

    }else{
      //console.log('gun error...');
    }
  }

  async function btnCheckCert(){
    //console.log("CERT KEY");
    if(publicKey.val != ""){
      const gun = gunState.val;
      let to = gun.user(publicKey.val);//get alias
      let who = await to.then() || {};//get alias data
      if(!who.alias){console.log("No Alias!");return;}
      const cert = await to.get('certs').get('privatemessage').then();
      if(cert){
        //console.log(cert);
        let timeexp = parseInt(cert.split(",")[1].split(":")[1]);
        //console.log(gunUnixToDate(timeexp));
        //console.log(JSON.parse(cert));
      }
    }
  }

  async function checkPublicKey(){
    //console.log(publicKey.val);
    if(publicKey.val != ""){
      const gun = gunState.val;
      const user = gun.user(publicKey.val)
      let alias = await user.get('alias').then();
      //let alias = "";
      if(alias){
        //console.log("alias: ",alias);
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
      //console.log("alias: ",alias);
      //return label("Status:NOT FOUND ");
      publicKeyStatus.innerText = "None";
      certStatus.innerText = "None";
      return;
    }
    //console.log("alias: ");
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

export {
  PrivateMessageCompose
}

