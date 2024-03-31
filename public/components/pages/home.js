/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import van from 'van';
import { navigate } from "vanjs-routing";
import { isLogin, aliasState } from '../context.js';

const {button, div, pre, a , li, p, ul} = van.tags;

const ElHome = () =>{

  const userName = van.derive(() => aliasState.val);

  const ElAccessRender = van.derive(()=>{
    if(isLogin.val){
      return div(
        button({ onclick: () => navigate('account',{replace:true}) }, 'Account'),
        button({ onclick: () => navigate('privatemessage',{replace:true}) }, 'Private Message'),
        button({ onclick: () => navigate('groupmessage',{replace:true}) }, 'Group Message'),
        button({ onclick: () => navigate('signout',{replace:true}) }, 'Sign Out')
      );
    }else{
      return button({ onclick: () => navigate('signin',{replace:true}) }, 'Sign In');
    }
  });

  return div(
    'Home [ Alias:',
    userName,
    ' ] ',
    //' ',
    //button({ onclick: () => routeTo('about') }, 'About'),
    ' ',
    ElAccessRender,
    button({onclick:()=>navigate("/help/profile")},'foo Help'),
  );
}

export{
  ElHome
}

