// https://gun.eco/docs/Auth

import {van} from '/dps.js';
import { 
  isLogin, 
  gunState, 
  aliasState,
  publicKeyState
} from '/context.js';
import { routeTo } from '/vanjs-router.js';

const {
  div, 
  button, 
  table, 
  tbody,
  tr,
  td,
  input, 
  label,
  textarea
} = van.tags;

const ELSignin = ()=>{
  const isPairLogin = van.state(false);
  const viewRender = van.derive(()=>{
    if(isPairLogin.val){
      return ElPairLogin();
    }else{
      return EldefaultLogin();
    }
  })
  
  return div(
    div(
      input({type:'checkbox',checked:isPairLogin,oninput:e=>isPairLogin.val=e.target.checked}),
      label('Pair')
    ),
    viewRender
  );
}

const EldefaultLogin= ()=>{
  const alias = van.state("test");
  const passphrase = van.state("012345678");
  const gun = gunState.val;

  function login(){
    //console.log(versionState.val)
    gun.user().auth(alias.val, passphrase.val, async function(ack){
      // done creating user!
      //console.log(ack);
      if(ack.err){
        console.log("BAD LOGIN");
        return;
      }
      isLogin.val = true;
      aliasState.val = ack.root.user.is.alias;
      publicKeyState.val = ack.root.user.is.pub;
      console.log("PUB: ", ack.root.user.is.pub)
      //let node = await gun.user().then();
      //console.log("node: ",node);
      routeTo('home');
    });
  }
  function Cancel(){routeTo('home');}
  
  return div(
    table(
      tbody(
        tr(
          td(
            label('Alias:')
          ),
          td(
            input({value:alias, oninput:(e)=>alias.val=e.target.value})
          )
        ),
        tr(
          td(
            label('Passphrase:')
          ),
          td(
            input({value:passphrase, oninput:(e)=>passphrase.val=e.target.value})
          )
        ),
        tr(
          td(
            button({onclick:()=>login()},'Login'),      
          ),
          td(
            button({onclick:()=>Cancel()},'Cancel'),
          )
        )
      )
    ),
  );
}

const ElPairLogin= ()=>{

  const pairKey = van.state('{}');
  const isBase64 = van.state(false);
  const isWorker = van.state(false);
  const worker1 = van.state('');
  const worker2 = van.state('');
  const workPair = van.state('');
  const ElWorkStatus = label('None');

  function btnPairLogin(){
    const gun = gunState.val;
    const user = gun.user();
    let pair = {};
    if(isWorker.val){
      console.log("WORK");
      pair = workPair.val;
      console.log(pair)
    }else{
      pair = JSON.parse(pairKey.val);
    }

    user.auth(pair, (ack)=>{
      console.log(ack);
      if(ack.err){
        console.log("BAD LOGIN");
        return;
      }
      isLogin.val = true;
      aliasState.val = ack.root.user.is.alias;
      publicKeyState.val = ack.root.user.is.pub;
      routeTo('home');
    },{});
    
  }
  // Status Work Decode
  van.derive(async ()=>{
    ElWorkStatus.innerText = '';
    if((worker1.val.length == 0) || (worker2.val.length == 0)){
      van.add(ElWorkStatus,tr(td(label(' Status: None '))));
      return;
    }

    let sec = await Gun.SEA.work(worker1.val, worker2.val);
    let result = await Gun.SEA.decrypt(pairKey.val,sec);
    console.log(result);
    if(result != null){
      workPair.val = result;
      van.add(ElWorkStatus,tr(td(label(' Status: PASS '))));
    }else{
      van.add(ElWorkStatus,tr(td(label(' Status: FAIL '))));
    }
  });

  async function btnPaste(){
    try {
      const text = await navigator.clipboard.readText()
      pairKey.val = text;
      console.log('Text pasted.');
    } catch (error) {
      console.log('Failed to read clipboard');
    }
  }

  return div(
    table(
      tbody(
        // tr(
        //   label('Base64:'),
        //   input({type:'checkbox',checked:isBase64,oninput:e=>isBase64.val=e.target.checked}),
        // ),
        tr(
          button({onclick:()=>btnPaste()},'Paste Pair'),
        ),
        tr(
          td(
            textarea({style:"width:256px;height:180px",value:pairKey,oninput:e=>pairKey.val=e.target.value})
          )
        ),
        //WORK CHECK
        tr(
          label('Worker:'),
          input({type:'checkbox',checked:isWorker,oninput:e=>isWorker.val=e.target.checked}),
        ),
        van.derive(()=>{
          if(isWorker.val){
            return tr(
              td(input({value:worker1,oninput:e=>worker1.val=e.target.value,placeholder:"Worker 1"}))
            );
          }else{
            return ' ';
          }
        }),
        van.derive(()=>{
          if(isWorker.val){
            return tr(
              td(input({value:worker2,oninput:e=>worker2.val=e.target.value,placeholder:"Worker 2"}))
            );
          }else{
            return ' ';
          }
        }),
        van.derive(()=>{
          if(isWorker.val){
            return tr(
              td(ElWorkStatus)
            );
          }else{
            return ' ';
          }
        }),
        //LOGIN
        tr(
          td(
            button({onclick:()=>btnPairLogin()},'Login')
          )
        ),
      )
    )
  );
}

export {
  ELSignin
}