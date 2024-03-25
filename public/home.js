
import {van, routeTo} from '/dps.js';

import { 
  isLogin,
  aliasState 
} from '/context.js';

const {button, div, pre, a , li, p, ul} = van.tags;

const ElHome = () =>{

  const userName = van.derive(() => aliasState.val);

  const ElAccessSigin = van.derive(()=>{
    if(isLogin.val){
      return button({ onclick: () => routeTo('signout') }, 'Sign Out');
    }else{
      return button({ onclick: () => routeTo('signin') }, 'Sign In');
    }
  });

  const ElAccessSignUp = van.derive(()=>{
    if(isLogin.val){
      return ' ';
    }else{
      return button({ onclick: () => routeTo('signup') }, 'Sign Up');
    }
  });

  const ElAccessAccount = van.derive(()=>{
    if(isLogin.val){
      return button({ onclick: () => routeTo('account') }, 'Account');
    }else{
      return ' ';
    }
  });

  const ElAccessPrivateMessage = van.derive(()=>{
    if(isLogin.val){
      return button({ onclick: () => routeTo('privatemessage') }, 'Private Message');
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
      return button({ onclick: () => routeTo('groupmessage') }, 'Group Message');
    }else{
      return ' ';
    }
  });

  return div(
    'Page Home. ',
    userName,
    ' ',
    button({ onclick: () => routeTo('about') }, 'About'),
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

