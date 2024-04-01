/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import van from 'van';
import { isLogin, aliasState, gunState, publicKeyState, board } from '../context.js';
import { navigate } from "vanjs-routing";
const {button, div, table, tbody, tr, td, label, input, center } = van.tags;

const ElForgot = ()=>{

  const alias = van.state('');
  const publickey = van.state('');
  const question1 = van.state('');
  const question2 = van.state('');
  const enc_hint = van.state('');
  const hint = van.state('');
  const status = van.state('None');

  async function getHint(){
    const gun = gunState.val;
    let to = gun.get(`~@${alias.val}`);
    let whoNode = await to.then();
    console.log(whoNode);
    if(!whoNode){
      board.show({message: "Alias Null!", durationSec: 1});
      return;
    }

    let sec = await SEA.work(question1.val, question2.val);
    let data = await SEA.decrypt(enc_hint.val, sec);
    console.log("data: ",data);
    if(data){
      board.show({message: "Pass Hint!", durationSec: 1});
    }else{
      board.show({message: "Fail Hint!", durationSec: 1});
    }
    hint.val = data;

  }

  async function inputAlias(e){
    alias.val = e.target.value;
    const gun = gunState.val;
    let to = gun.get(`~@${alias.val}`);
    let whoData = await to.then();
    console.log(whoData);
    let pub = null;
    if(whoData){
      whoData = Object.keys(whoData);
      for(let i = 0;i < whoData.length;++i){
        console.log(whoData[i]);
        console.log(Gun.SEA.opt.pub(whoData[i]));
        if(Gun.SEA.opt.pub(whoData[i])){
          //pub = whoData[i];
          pub = Gun.SEA.opt.pub(whoData[i]);
          console.log("pub: ", pub)
          break;
        }
      }
      //console.log(pub);
      let hintNode = await gun.user(pub).get('hint').then()
      //console.log(hintNode);
      enc_hint.val = hintNode
      status.val = "Found!";
      board.show({message: "Found Alias!", durationSec: 1});
    }else{
      status.val = "Null";
    }
  }

  return div(
    table(
      tbody(
        tr(
          td(
            label('Info:')
          ),
          td(
            label({}, 'Recovery Alias Hint')
          )
        ),
        tr(
          td(
            label(' Alias: ')
          ),
          td(
            input({value:alias,oninput:e=>inputAlias(e)})
          )
        ),
        tr(
          td(
            label(' Status: ')
          ),
          td(
            label(van.derive(()=>status.val))
          )
        ),
        tr(
          td(
            label('Question 1:')
          ),
          td(
            input({value:question1,oninput:e=>question1.val=e.target.value})
          )
        ),
        tr(
          td(
            label('Question 2:')
          ),
          td(
            input({value:question2,oninput:e=>question2.val=e.target.value})
          )
        ),
        tr(
          td(
            label('Hint:')
          ),
          td(
            input({value:hint,oninput:e=>hint.val=e.target.value})
          )
        ),
        tr(
          td({colspan:"2"}, 
            center(
              button({onclick:()=>navigate('/',{replace:true})},'Cancel'),
              button({onclick:()=>getHint()},'Get Hint'),
            )
          ),
        )
      )
    )
  );
}

export {
  ElForgot
}