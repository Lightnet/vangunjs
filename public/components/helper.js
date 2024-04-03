/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import { board } from "./context";

async function copyID(id){
  try {
    await navigator.clipboard.writeText(id);
    board.show({message: "Copy ID!", durationSec: 1});
    //console.log('Content copied to clipboard');
  } catch (err) {
    //console.error('Failed to copy: ', err);
    board.show({message: "Fail ID!", durationSec: 1});
  }
}

export {
  copyID
}