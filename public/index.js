/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

//import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.5.0.min.js"
//import { Route, routeTo } from '/vanjs-router.js';
//import {van} from '/dps.js';

import 'https://cdn.jsdelivr.net/npm/gun/gun.js';
import 'https://cdn.jsdelivr.net/npm/gun/sea.js';

import { gunState, isLogin } from '/context.js';
import { ELSignin } from './signin.js';
import { ELSignup } from './signup.js';
import { ElHome } from './home.js';
import { ELGroupMessageRoom, ElGroupMessage } from './groupmessage.js';
import { ElAccount, ElForgot } from './account.js';
import { btnSignOut } from './signout.js';
import { ElPrivateMessage } from './privatemessage.js';

import van from 'vanjs-core';
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";

const { div, p, button, label } = van.tags;

var gun = GUN("http://127.0.0.1:3000/gun");
gunState.val = gun;


function App() {
  return Router({
    //basename: "", // Optional base name (All links are now prefixed with '/vanjs-routing')
    routes: [
      { path: "/", component: ElHome },
      { path: "/signup", component: ELSignup },
      { path: "/signin", component: ELSignin },
      { path: "/signout", component: btnSignOut },
      { path: "/forgot", component: ElForgot },
      { path: "/account", component: ElAccount },
      { path: "/privatemessage", component: ElPrivateMessage },
      { path: "/groupmessageroom/:name", component: ELGroupMessageRoom },
      { path: "/groupmessage", component: ElGroupMessage },
    ]
  });
}

van.add(document.body, App())