/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

//tests

import van from 'vanjs-core';
import {  Router, Link, navigate, getRouterPathname, getRouterParams } from "vanjs-routing";


const {button, div, label, select, option, input, p, table, tbody, tr, td, thead} = van.tags;
//import { gunState, isLogin, board } from '/context.js';
function GroupRoomComponent(){
  van.derive(() => {
    console.log(getRouterParams()); // { section: "profile" }
  });

  return div(
    p("GroupRoomComponent"),
    Link({ href: "/" }, "Back to Home"),
    button({ onclick: () => navigate("/") }, "Home")
  );
}

export {
  GroupRoomComponent
}