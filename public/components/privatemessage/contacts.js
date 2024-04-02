/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import van from 'van';
import { board, gunState } from '../context.js';

const { div, label, input, select, option, span, button, fragment } = van.tags;
//console.log(fragment)

function UISelectContacts(){

  const publicKey = van.state('');
  const isInputPublicKey = van.state(false);
  const publicKeys = van.state(new Map());
  const status = van.state("None");

  const idKey = van.state('');

  function onSelect(e){
    console.log(e.target.value)
    let id = e.target.value;
    idKey.val = id;
    let contact = publicKeys.val.get(id);
    console.log(contact);
    if(contact){
      publicKey.val = contact.pub;
    }
  }

  function getContactList(){
    const gun = gunState.val;
    const user = gun.user();
    const userPair = user._.sea;
    const gunInstance = Gun(location.origin+"/gun");

    gunInstance.user().auth(userPair, async () => {
      gunInstance.user().get('contacts').map().once( async (data,key)=>{
        console.log("key: ", key);
        console.log("data: ", data);
        if(data == "null"){//delete contact
          return;
        }
        let decData = await Gun.SEA.decrypt(data, userPair);
        console.log("decData: ", decData);
        if(decData){
          publicKeys.val = new Map(publicKeys.val.set(key, decData))
        }
      });
    });
  }

  async function addContact(){
    if(typeof publicKey.val === 'string' && publicKey.val.length === 0){
      console.log("EMPTY!");
      return;
    }
    const gun = gunState.val;
    const user = gun.user();
    const userPair = user._.sea;
    const gunInstance = Gun(location.origin+"/gun");
    let to = gun.user(publicKey.val);
    let who = await to.then();
    if(!who?.alias){
      console.log("NOT FOUND!")
      return;
    }

    gunInstance.user().auth(userPair, async () => {
      const random_id = String.random(16);
      let enc = await Gun.SEA.encrypt({
        alias:who.alias,
        pub:publicKey.val
      } ,userPair);
      gunInstance.user().get('contacts').get(random_id).put(enc);
    });
  }

  async function removeContact(){
    if(typeof publicKey.val === 'string' && publicKey.val.length === 0){
      console.log("EMPTY!");
      return;
    }
    if(typeof idKey.val === 'string' && idKey.val.length === 0){
      console.log("EMPTY!");
      return;
    }
    const gun = gunState.val;
    const user = gun.user();
    const userPair = user._.sea;
    const gunInstance = Gun(location.origin+"/gun");
    let to = gun.user(publicKey.val);
    let who = await to.then();
    if(!who.alias){
      console.log("NOT FOUND!")
      return;
    }

    gunInstance.user().auth(userPair, async () => {
      gunInstance.user().get('contacts').get(idKey.val).put("null");
      console.log("DELETE ALIAS CONTACT!")
    });

  }

  function toggleMode(){
    isInputPublicKey.val = !isInputPublicKey.val;
    //console.log(isInputPublicKey.val);
  }

  async function typeLookUp(e){
    let pub = e.target.value;
    publicKey.val = pub;
    if(typeof publicKey.val === 'string' && publicKey.val.length === 0){
      console.log("EMPTY!");
      return;
    }
    const gun = gunState.val;
    //const user = gun.user();
    //const userPair = user._.sea;
    //const gunInstance = Gun(location.origin+"/gun");
    let to = gun.user(pub);
    let who = await to.then();
    if(!who?.alias){
      console.log("NOT FOUND!")
      status.val = " No Alias! "
      return;
    }else{
      status.val = ` Found ${who.alias}! `;
    }
  }

  getContactList();

  return fragment(
    button({onclick:toggleMode}," Contacts: "),
    van.derive(()=>{
      if(isInputPublicKey.val){
        let myContacts = [];
        publicKeys.val.forEach((data, key)=>{
          myContacts.push(
            option({value:key}, data.alias)
          );
        })
        return fragment(
          select({onclick:onSelect,onchange:onSelect},myContacts),
        )
      }else{
        return fragment(
          input({value:publicKey,oninput:typeLookUp}),
          button({onclick:addContact},'+'),
          button({onclick:removeContact},'-'),
        )
      }
    }),
    van.derive(()=>status.val)
  )
}

export {
  UISelectContacts
}