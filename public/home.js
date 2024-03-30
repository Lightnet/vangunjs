/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import {van, routeTo} from '/dps.js';
import { navigate } from "vanjs-routing";
import { 
  isLogin,
  aliasState 
} from '/context.js';

const {button, div, pre, a , li, p, ul} = van.tags;

const ElHome = () =>{

  const userName = van.derive(() => aliasState.val);

  const ElAccessSigin = van.derive(()=>{
    if(isLogin.val){
      //return button({ onclick: () => routeTo('signout') }, 'Sign Out');
      return button({ onclick: () => navigate('signout',{replace:true}) }, 'Sign Out');
    }else{
      //return button({ onclick: () => routeTo('signin') }, 'Sign In');
      return button({ onclick: () => navigate('signin',{replace:true}) }, 'Sign In');
    }
  });

  const ElAccessSignUp = van.derive(()=>{
    if(isLogin.val){
      return ' ';
    }else{
      //return button({ onclick: () => routeTo('signup') }, 'Sign Up');
      return button({ onclick: () => navigate('signup',{replace:true}) }, 'Sign Up');
    }
  });

  const ElAccessAccount = van.derive(()=>{
    if(isLogin.val){
      //return button({ onclick: () => routeTo('account') }, 'Account');
      return button({ onclick: () => navigate('account',{replace:true}) }, 'Account');
    }else{
      return ' ';
    }
  });

  const ElAccessPrivateMessage = van.derive(()=>{
    if(isLogin.val){
      //return button({ onclick: () => routeTo('privatemessage') }, 'Private Message');
      return button({ onclick: () => navigate('privatemessage',{replace:true}) }, 'Private Message');
    }else{
      return ' ';
    }
  });

  // const ElAccessChatRoom = van.derive(()=>{
  //   if(isLogin.val){
  //     return button({ onclick: () => routeTo('chatroom') }, 'Chat Room');
  //   }else{
  //     return ' ';
  //   }
  // });

  const ElAccessGroupMessage = van.derive(()=>{
    if(isLogin.val){
      //return button({ onclick: () => routeTo('groupmessage') }, 'Group Message');
      return button({ onclick: () => navigate('groupmessage',{replace:true}) }, 'Group Message');
    }else{
      return ' ';
    }
  });

  return div(
    'Home [ Alias:',
    userName,
    ' ] ',
    //' ',
    //button({ onclick: () => routeTo('about') }, 'About'),
    ' ',
    ElAccessSigin,
    ' ',
    ElAccessSignUp,
    ' ',
    ElAccessAccount,
    ' ',
    ElAccessPrivateMessage,
    //' ',
    //ElAccessChatRoom,
    ' ',
    ElAccessGroupMessage,
  );
}

export{
  ElHome
}

