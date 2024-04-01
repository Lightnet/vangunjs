/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import van from 'van';
import { gunUnixToDate } from '../../libs/helper.js';
import { gunState } from '../context.js';
//import { Modal, MessageBoard } from "vanjs-ui";
//import { navigate } from "vanjs-routing";

const { div, button, input, textarea, label, table, tbody, tr, td, select, option } = van.tags;

const PrivateMessageOptions = ()=>{
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
      //console.log("data: ", data);
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

    //console.log(numExpire.val);
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

export {
  PrivateMessageOptions
}