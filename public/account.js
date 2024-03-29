/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

import {van} from '/dps.js';
import { 
  isLogin,
  aliasState,
  gunState,
  publicKeyState
} from '/context.js';

const {
  button, 
  div, 
  table,
  tbody,
  tr,
  td,
  label,
  input
} = van.tags;

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
      button({onclick:()=>view.val='profile'},'Profile'),
      button({onclick:()=>view.val='changepassphrase'},'Change Passphrase'),
      button({onclick:()=>view.val='hint'},'Hint'),
      button({onclick:()=>view.val='certs'},'Certs'),
    ),
    viewRender
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
  ElDisplayAlias
}