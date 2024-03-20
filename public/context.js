import {van} from '/dps.js';

//const gunState = van.state(null);
//const versionState = van.state('');
//const aliasState = van.state('Guest');

class AppContext {
  static gun = van.state(null);
  static version = van.state('0.0.1');
  static alias = van.state('Guest');
  static isLogin = van.state(false);
}

const isLogin = van.state(false);
const gunState = van.state(null);
const aliasState = van.state('Guest');
const publicKeyState = van.state('');

export {
  AppContext,
  isLogin,
  gunState,
  aliasState,
  publicKeyState
}