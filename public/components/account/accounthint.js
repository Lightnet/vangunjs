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

export {
  accountHint
}