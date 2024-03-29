/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import 'https://cdn.jsdelivr.net/npm/gun/gun.js';
import 'https://cdn.jsdelivr.net/npm/gun/sea.js';

//console.log("init");
//localStorage.clear();
async function main(){
  //gun = Gun();
  //console.log(Gun.SEA);

  //console.log("MAIN");
  var Alice = await SEA.pair()
  var Bob = await SEA.pair()
  var Dave = await SEA.pair()

  Alice = {
    pub:"FK0FNcpeWznviFlkFLpE5mdHtScYSBF-utLmYaWeRa4.I9ybrVzD7sE7hxicZ3qxFDIr_gr6E9hVCBaixs3sj4Q",
    priv:"hM8s_tbW3XTAOuAxYgaHvQ55riiUja2J_x8nrC9EZzI",
    epub:"sQ3do9OoHXH5J4jQQckBT0sENAsD-HtuTiwU97GaaIQ.Uu1UczGOE9eTKtYDRceNUtRWT6hHecb5VHMTUfI3R3A",
    epriv:"A6XagUBnqqcjuF66Aefmvw0d8e6Dl8TjLn42sZY2GpU"
  };

  Bob = {
    pub:"6fz0TaRie7rVEtp5lNYpVNDEHOG_x6DGzl3oKxe-6GQ.lYLW64gFNT4z_ygEWaBNppp1YtycICudw5zEco3cH4I",
    priv:"fYwiLZyFGKwbK7Y2AnWY3MjZoNRtVQguVfneenlJQw0",
    epub:"b7gQsAfv_8e1c3jbSW1hOMVJxpzfd6T2WqSR-fEhaAk.FsW6ZOFxIsHjI3_DtKqt09-jJMcvCsxR6iEMZwVJOo4",
    epriv:"1LdZJuS8bdIg-_w1O6RbIIC7Jjm-qQaTHCA8T8BCo1g"
  };

  Dave = {
    pub:"4H0GdfKJ8Yt4G3zIQmgMraW41rqKdUsjAPOhOJOiAAg.oAo4E9arP1uuYOYNChf4C9MDo8PphuKTVUaQhyG75YY",
    priv:"eTgoBND36Ld6jMCBOgAnxsh3Z5zskcqktTdmtvQ9MZE",
    epub:"tze992P-LWTjoRZMHLG9NcM20CAc7MIkaD8ESApm6xE.cV93hYFxIeT0EgdGhxI_UHOIm-t7_sUBuGyLLjw8geg",
    epriv:"9smF22A0xwyyKpwJEa94pS3LC9eeHBXpowX8l9MgyNU"
  }

  //console.log(Alice);
  //console.log(Bob);
  //console.log(Dave);

  var gunInstance0 = Gun();
  gunInstance0.user().auth(Dave, async(ack)=>{
    console.log("Dave ",ack);
  })

  let gunInstance1 = Gun();
  //console.log(gunInstance1)
  gunInstance1.user().auth(Alice, async(ack)=>{
    console.log("Alice: ",ack);
    //gunInstance1.user().get("test").put("foo");
  });
  // let aliasNode = gunInstance1.user(Alice.pub);
  // let aliasData = await aliasNode.then();
  // console.log("aliasNode: ",aliasNode);
  // console.log("aliasData: ",aliasData);

  var gunInstance2 = Gun();
  gunInstance2.user().auth(Bob, async(ack)=>{
    console.log("Bob ",ack);
  })
  
  //does not work, not tested well, might need one person per cert
  //var certificate = await SEA.certify([Bob.pub, Dave.pub], [{"*": "inbox", "+": "*"}, {"*": "stories"}], Alice, null, {expiry: Gun.state()+(60*60*24*1000)})  
  //work for this
  var certificate = await SEA.certify(Bob.pub, [{"*": "inbox", "+": "*"}, {"*": "stories"}], Alice, null, {expiry: Gun.state()+(60*60*24*1000)})  
  var gunInstance3 = Gun();

  // required login
  gunInstance3.user().auth(Bob, async(ack)=>{
    //console.log("Bob ",ack);

    //ok
    //gunInstance3.user(Alice.pub).get('inbox').get(Bob.pub).get("test").put("hello world", (ack)=>{
      //console.log(ack);
    //}, {opt: {cert: certificate}});

    //ok
    // gunInstance3.user(Alice.pub).get('inbox').get('deeper'+Bob.pub).put('hello world', (ack)=>{
    //   console.log(ack);
    // }, {opt: {cert: certificate}});

    //ok
    // gunInstance3.user(Alice.pub).get('inbox').get(Bob.pub).once((data,key)=>{
    //   console.log("content: ",data);
    //   console.log("key: ",key);
    // });
    
  })


  // fail no login
  // gunInstance3.user(Alice.pub).get('inbox').get(Bob.pub).put('hello world', (ack)=>{
  //   console.log(ack);
  // }, {opt: {cert: certificate}});

  // FAIL no login
  // gunInstance3.user(Alice.pub).get('inbox').get('deeper'+Bob.pub).put('hello world', (ack)=>{
  //    console.log(ack);
  // }, {opt: {cert: certificate}});

  // let aliasData = await gunInstance3.user(Alice.pub).then();
  // console.log(aliasData);

  //gun.get('~'+Alice.pub).get('inbox').get('deeper'+Bob.pub).put('hello world', (ack)=>{
    //console.log(ack);
  //}, {opt: {cert: certificate}});
}

main()