

import {van} from '/dps.js';
import { MessageBoard } from "vanjs-ui";

const versionState = van.state('0.0.1');
const isLogin = van.state(false);
const gunState = van.state(null);
const aliasState = van.state('Guest');
const publicKeyState = van.state('');
const board = new MessageBoard({top: "20px"})

export {
  //AppContext,
  isLogin,
  gunState,
  aliasState,
  publicKeyState,
  versionState,
  board
}