/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import 'https://cdn.jsdelivr.net/npm/gun/gun.js';
import 'https://cdn.jsdelivr.net/npm/gun/sea.js';
//import van from 'vanjs-core';
//import van from 'van';
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";

import { HomePage } from './pages/home.js';

import { gunState, isLogin } from '/components/context.js';
import { ELSignin } from './auth/signin.js';
import { ELSignup } from './auth/signup.js';
import { btnSignOut } from './auth/signout.js';
import { ELGroupMessageRoom, ElGroupMessage } from './groupmessage/groupmessage.js';
import { ElForgot } from './auth/forgot.js';
import { PrivateMessagePage, PrivateMessageComposePage, PrivateMessageOptionsPage } from './pages/privatemessage.js';
import { AccountCertsPage, AccountChangePassphrasePage, AccountHintPage, AccountPage } from './pages/account.js';

//const { div, p, button, label } = van.tags;

var gun = GUN("http://127.0.0.1:3000/gun");
gunState.val = gun;

function App() {
  return Router({
    //basename: "", // Optional base name (All links are now prefixed with '/vanjs-routing')
    routes: [
      { path: "/", component: HomePage },
      //{ path: "/", component: HomeComponent },
      //AUTH
      { path: "/signup", component: ELSignup },
      { path: "/signin", component: ELSignin },
      { path: "/signout", component: btnSignOut },
      { path: "/forgot", component: ElForgot },
      //account
      { path: "/account", component: AccountPage },
      { path: "/account/changepassphrase", component: AccountChangePassphrasePage },
      { path: "/account/hint", component: AccountHintPage },
      { path: "/account/certs", component: AccountCertsPage },
      //Private Message Page
      { path: "/privatemessage", component: PrivateMessagePage },
      { path: "/privatemessage/compose", component: PrivateMessageComposePage },
      { path: "/privatemessage/options", component: PrivateMessageOptionsPage },
      //{ path: "/privatemessage/:view/:id", component: PrivateMessagePage },
      //Group Message Page
      { path: "/groupmessage", component: ElGroupMessage },
      { path: "/groupmessageroom/:roomid", component: ELGroupMessageRoom },
      //{ path: "/groupmessageroom/:roomid", component: GroupRoomComponent },
      //{ path: "/help/:section", component: HelpComponent }
    ]
  });
}

// function HomeComponent() {
//   return div(
//     p("Home"), 
//     Link({ href: "/about?foo=bar" }, "Goto About"),
//     ' ',
//     Link({ href: "/help/profile" }, "Goto Help"),
//     ' ',
//     button({onclick:()=>navigate("/about?foo=bar")},'foo about'),
//     ' ',
//     button({onclick:()=>navigate("/help/profile")},'foo Help'),
//     ' ',
//   );
// }

// function HelpComponent() {
//   van.derive(() => {
//     console.log(getRouterParams()); // { section: "profile" }
//   });

//   return div(
//     p("Help"),
//     Link({ href: "/" }, "Back to Home"),
//     button({ onclick: () => navigate("/") }, "Home")
//   );
// }

export default App;