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

const ElDisplayAlias = ()=>{
  const userName = van.derive(()=>aliasState.val);
  return label(userName)
}

const ElAccount = ()=>{

  const view = van.state('profile');

  const viewRender = van.derive(()=>{
    //console.log(view.val)
    if(view.val == 'profile'){
      return accountInfo();
    }
    if(view.val == 'changepassphrase'){
      return accountChangePassphrase();
    }
    if(view.val == 'hint'){
      return accountHint();
    }
    if(view.val == 'certs'){
      return accountCerts();
    }
  })

  return div(
    div(
      button({onclick:()=>navigate('/',{replace:true})},'Back'),
      button({onclick:()=>view.val='profile'},'Profile'),
      button({onclick:()=>view.val='changepassphrase'},'Change Passphrase'),
      button({onclick:()=>view.val='hint'},'Hint'),
      button({onclick:()=>view.val='certs'},'Certs'),
    ),
    viewRender
  );
}

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

const accountInfo = ()=>{
  const alias = van.derive(()=> aliasState.val);
  const publicKey = van.derive(()=> publicKeyState.val);

  async function copyKey(){
    try {
      await navigator.clipboard.writeText(publicKeyState.val);
      console.log('Content copied to clipboard');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  return div(
    table(
      tbody(
        tr(
          td(
            label('Alias:')
          ),
          td(
            label({}, alias)
          )
        ),
        tr(
          td(
            button({onclick:()=>copyKey()},'Public Key:')
          ),
          td(
            input({value:publicKey,readonly:true})
          )
        ),
      )
    )
  );
}

const accountChangePassphrase = ()=>{
  const alias = van.state('');

  const PassphraseOld = van.state('012345678');
  const PassphraseNew = van.state('012345678');

  function btnApply(){
    const gun = gunState.val;
    console.log(PassphraseOld.val);
    console.log(PassphraseNew.val);
    const user = gun.user();
    console.log(user);
    alias.val = user.is.alias;

    user.auth(alias.val, PassphraseOld.val, (ack)=>{
      console.log(ack);
      if(ack.err){
        console.log("FAIL")
      }
    },{change: PassphraseNew.val})

  }

  return div(
    table(
      tbody(
        tr(
          td(
            label('Alias:')
          ),
          td(
            label({}, alias)
          )
        ),
        tr(
          td(
            label('Passprhase Old:')
          ),
          td(
            input({value:PassphraseOld,oninput:(e)=>PassphraseOld.val=e.target.value})
          )
        ),
        tr(
          td(
            label('Passprhase New:')
          ),
          td(
            input({value:PassphraseNew,oninput:(e)=>PassphraseNew.val=e.target.value})
          )
        ),
        tr(
          td({colspan:2}, button({onclick:()=>btnApply()},'Apply'))
        )
      )
    )
  );
}

const accountHint = ()=>{

  const question1 = van.state('');
  const question2 = van.state('');
  const hint = van.state('');

  async function getHint(){
    const gun = gunState.val;
    const user = gun.user();
    const pair = user._.sea;
    var q1 = await user.get('question1').then();
    console.log('question1: ', q1);
    var dec = await SEA.verify(q1, pair.pub);
    console.log('dec: ', dec);
    var data = await SEA.decrypt(dec, pair);
    console.log('data: ', data);
    question1.val = data;

    var q2 = await user.get('question2').then();
    dec = await SEA.verify(q2, pair.pub);
    data = await SEA.decrypt(dec, pair);
    question2.val = data;
    let sec = await SEA.work(question1.val, question2.val);

    var h = await user.get('hint').then();
    data = await SEA.decrypt(h, sec);
    hint.val = data;

  }

  async function applyHint(){
    const gun = gunState.val;
    console.log("question1: ",question1.val);
    console.log("question2: ",question2.val);
    console.log("hint: ",hint.val);

    const user = gun.user();

    console.log(user);
    const pair = user._.sea;
    var enc = await SEA.encrypt(question1.val, pair);
    var data = await SEA.sign(enc, pair);
    console.log("question1:",data)
    user.get('question1').put(data);

    enc = await SEA.encrypt(question2.val, pair);
    data = await SEA.sign(enc, pair);
    console.log("question2:",data)
    user.get('question2').put(data);

    let sec = await SEA.work(question1.val, question2.val);
    data = await SEA.encrypt(hint.val, sec);
    console.log("hint:",data)
    user.get('hint').put(data);
  }

  return div(
    table(
      tbody(
        tr(
          td(
            label('TYPE:')
          ),
          td(
            label({}, 'Hint')
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
          td({}, button({onclick:()=>getHint()},'Get')),
          td({}, button({onclick:()=>applyHint()},'Apply')),
        )
      )
    )
  );
}

const accountCerts = ()=>{

  return div(
    label('CERTS')
  );
}

export {
  ElAccount,
  ElDisplayAlias,
  ElForgot
}