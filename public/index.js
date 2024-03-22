

//import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.5.0.min.js"
//import { Route, routeTo } from '/vanjs-router.js';
import {van, Route, routeTo} from '/dps.js';
import '/van-x.nomodule.min.js';
import 'https://cdn.jsdelivr.net/npm/gun/gun.js';
import 'https://cdn.jsdelivr.net/npm/gun/sea.js';
//console.log(Gun.SEA);

import { gunState } from '/context.js';
import { ELSignin } from './signin.js';
import { ELSignup } from './signup.js';
import { ElHome } from './home.js';
import { ELGroupMessageRoom, ElGroupMessage } from './groupmessage.js';
import { ElAccount } from './account.js';
import { btnSignOut } from './signout.js';
import { ElPrivateMessage } from './privatemessage.js';
import { gunUnixTime, gunUnixToDate, unixTime } from './helper.js';

const {button, div, label} = van.tags;

//console.log(vanX);
//const obj = vanX.reactive({a: 1, b: 2})
//console.log(obj);
//console.log(Gun.state())
//console.log(gunUnixTime())
//console.log(unixTime())
//console.log(gunUnixToDate(Gun.state()))

//console.log(String.random(16));

//AppContext._version.val = "test";
//console.log("init");
var gun = GUN("http://127.0.0.1:3000/gun");
gunState.val = gun;
// https://gun.eco/docs/User
//gun.on( 'auth', ack => {
  //console.log('auth', ack);
  //console.log('Authentication was successful: ', ack)
//});

// gun.get('mark').put({
//   name: "Mark",
//   email: "mark@gun.eco",
// });
// gun.get('mark').on((data, key) => {
//   console.log("realtime updates:", data);
// });
//setInterval(() => { gun.get('mark').get('live').put(Math.random()) }, 90);
//const gunState = AppContext._gun;

//const userName = van.derive(() => AppContext.alias.val);
// https://github.com/iuroc/vanjs-router
const App=()=>{

  //const _isLogin = van.derive(() => {
    //console.log(isLogin.val);
  //})

  const roomID = van.state('');
  const viewRender = van.derive(()=>{
    //console.log("roomID.val: ", roomID.val);
    let roomId = roomID.val;
    if(typeof roomId === 'string' && roomId.length > 0){
      return  ELGroupMessageRoom({groupID:roomID.val});
    }else{
      return div('None!');
    }
  });

  return div(
    Route({ name: 'home' },
      ElHome()
    ),
    Route({ name: 'about' },
      button({ onclick: () => routeTo('home') }, 'Back To Home'), ' ',
      'Page About.',
    ),
    Route({ name: 'signup' },
      button({ onclick: () => routeTo('home') }, 'Back To Home'), ' ',
      'Sign Up',
      ELSignup()
    ),
    Route({ name: 'signin' },
      button({ onclick: () => routeTo('home') }, 'Back To Home'), ' ',
      'Sign In',
      ELSignin()
    ),
    Route({ name: 'signout' },
      button({ onclick: () => routeTo('home') }, 'Back To Home'), ' ',
      'Sign Out',
      btnSignOut()
    ),
    Route({ name: 'account' },
      button({ onclick: () => routeTo('home') }, 'Back To Home'), ' ',
      'Account',
      ElAccount()
    ),
    Route({ name: 'privatemessage' },
      button({ onclick: () => routeTo('home') }, 'Back To Home'), ' ',
      'Private Message',
      ElPrivateMessage()
    ),
    //Route({ name: 'chatroom' },
      //button({ onclick: () => routeTo('home') }, 'Back To Home'), ' ',
      //'chat',
    //),
    Route({ name: 'groupmessage' },
      button({ onclick: () => routeTo('home') }, 'Back To Home'), ' ',
      'Group Message',
      ElGroupMessage()
    ),
    ()=>{
      
      return Route({
        name: 'groupmessageroom', 
        onLoad(route){
          //console.log("ID: ",route.args);
          let [id] = route.args;
          //console.log(typeof id);
          //console.log("room id: ",id);
          if(typeof id === 'string' && id.length === 0){
          }else{
            //console.log("SET ROOM ID", id);
            roomID.val = id;
          }
        }
      },
      viewRender
      //div('group Id: ', roomID),
      
      
      //testKey({id:roomID})
      )
    }
  )
}

const testKey = ({id})=>{
  //console.log("KEY", id);

  const msg = van.derive(()=>{
    console.log("derive id: ",id.val);
    //console.log(id);
  });


  return label('TESTS '+ id);
}

van.add(document.body, App())