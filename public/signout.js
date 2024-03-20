

import { gunState } from '/context.js';
import { van, routeTo } from '/dps.js';
const {button, div, pre, a , li, p, ul} = van.tags;

const btnSignOut = ()=>{
  function signout(){
    const gun = gunState.val;
    const user = gun.user();
    user.leave();
    
    routeTo('home');
  }
  return button({ onclick: () => signout() }, 'Logout');
}

export {
  btnSignOut
}