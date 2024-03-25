import {van} from '/dps.js';

import { gunState } from '/context.js';
import { QRCode } from '/qrcode.min.js';

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
import { routeTo } from '/vanjs-router.js';
import { Modal, MessageBoard } from "vanjs-ui";

const ELSignup = ()=>{

  const isPairLogin = van.state(true);
  const viewRender = van.derive(()=>{
    if(isPairLogin.val){
      return ElPairSignUp();
    }else{
      return ElDefaultSignUp();
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

const ElDefaultSignUp =()=>{
  const board = new MessageBoard({top: "20px"});
  const alias = van.state("");
  const passphrase = van.state("012345678");

  function btnSignUp(){
    //console.log(versionState.val)
    const gun = gunState.val;
    gun.user().create(alias.val, passphrase.val, async function(ack){
      console.log(ack);
      if(ack.err){
        //console.log("ERROR!");
        board.show({message: ack.err, durationSec: 2});
        return;
      }
      // done creating user!
      board.show({message: "Create Alias User!", durationSec: 2});
    });
  }

  function btnCancel(){
    routeTo('home')
  }
  
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
            button({onclick:()=>btnSignUp()},'Register'),      
          ),
          td(
            button({onclick:()=>btnCancel()},'Cancel'),
          )
        )
      )
    ),
  );
}

// https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function save(filename, data) {
  const blob = new Blob([data], {type: 'text/plain'});
  if(window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename);
  }
  else{
      const elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = filename;        
      document.body.appendChild(elem);
      elem.click();        
      document.body.removeChild(elem);
  }
}

const ElPairSignUp= ()=>{
  const board = new MessageBoard({top: "20px"});
  const pairKey = van.state('{}'); //string
  const isWorker = van.state(false);
  const isBase64 = van.state(true);
  const isDisplayQR = van.state(false);
  const isDisplayQR2 = van.state(false);

  const worker1 = van.state('');
  const worker2 = van.state('');

  const EncodePair = van.state('');

  //const div_qr = div();

  async function generatePair(){
    var pair = await Gun.SEA.pair()
    console.log(pair);
    //div_qr.innerText = '';
    pairKey.val = JSON.stringify(pair);
    //van.add(div_qr, QRCode(pairKey.val));
  }

  async function btndownload(){
    //download('seapair.txt', pairKey.val);
    let hash = await Gun.SEA.work(pairKey.val, null, null, { name: 'SHA-256',encode:'hex'});
    let fileName = 'SEA_PAIR_SHA-256_' + hash + '.txt';
    save(fileName, pairKey.val);
  }

  async function btnWorkDownload(){
    //download('seapair.txt', pairKey.val);
    let hash = await Gun.SEA.work(EncodePair.val, null, null, { name: 'SHA-256',encode:'hex'});
    let fileName = 'SEA_WORK_PAIR_SHA-256_' + hash + '.txt';
    save(fileName, EncodePair.val);
  }

  async function copyPair(){
    try {
      await navigator.clipboard.writeText(pairKey.val);
      console.log('Content copied to clipboard');
      board.show({message: "Copy!", durationSec: 2});
      /* Resolved - text copied to clipboard successfully */
    } catch (err) {
      console.error('Failed to copy: ', err);
      /* Rejected - text failed to copy to the clipboard */
    }
  }

  async function copyWorkPair(){
    try {
      await navigator.clipboard.writeText(EncodePair.val);
      console.log('Content copied to clipboard');
      board.show({message: "Copy!", durationSec: 2});
      /* Resolved - text copied to clipboard successfully */
    } catch (err) {
      console.error('Failed to copy: ', err);
      /* Rejected - text failed to copy to the clipboard */
    }
    let hash = await Gun.SEA.work('text', null, null, { name: 'SHA-256' });
    console.log(hash);
  }

  function btnPairSignUp(){
    const gunInstance = Gun(location.origin+"/gun");
    //console.log("pairKey.val: ",pairKey.val);
    const pair = JSON.parse(pairKey.val);

    //user.create(JSON.parse(pairKey.val), function(ack){
    gunInstance.user().auth(pair, async function(ack){
      // done creating user!
      console.log(ack);

      board.show({message: "Auth Pair!", durationSec: 2});
      //gunInstance.user().get('alias').put(pair.pub)
      //console.log(gunInstance.user());
      //let name = await gunInstance.user().get('alias').then();
      //console.log( "name: ", name);
      //let node = await gunInstance.user().then();
      //console.log(node);
      //let node2 = await gunInstance.user(pair.pub).then();
      //console.log(node2);
    });
  }

  //decode while input of worker 1 and 2.
  van.derive(async ()=>{
    if((worker1.val.length == 0) || worker2.val.length == 0){
      return;
    }
    let sec = await Gun.SEA.work(worker1.val, worker2.val);
    let data = await Gun.SEA.encrypt(pairKey.val, sec);
    //console.log(data);
    //console.log(typeof data);
    EncodePair.val = data
  })

  return div(
    table(
      tbody(
        // tr(
        //   td({colspan:2},
        //     label('Base64'),
        //     input({type:'checkbox',checked:isBase64,oninput:e=>isBase64.val=e.target.checked})
        //   )
        // ),
        tr(
          td({colspan:2},
            button({onclick:()=>generatePair()},'Generate Pair')
          )
        ),
        tr(
          td({colspan:2},
            textarea({style:"width:256px;height:180px",value:pairKey})
          ),
        ),
        // QR CODE
        tr(
          td({colspan:2},
            label('QR'),
            input({type:'checkbox',checked:isDisplayQR,oninput:e=>isDisplayQR.val=e.target.checked})
          )
        ),
        van.derive(()=>{
          if(isDisplayQR.val){
            return tr(
              td(
                QRCode(pairKey.val)
              )
            );
          }else{
            return ' ';
          }
        }),
        tr({},
          td(
            button({onclick:()=>btndownload()},'Download'),
            button({onclick:()=>copyPair()},'Copy')
          )
        ),
        tr(
          td({colspan:2},
            label('Worker'),
            input({type:'checkbox',checked:isWorker,oninput:e=>isWorker.val=e.target.checked})
          )
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
              textarea({style:"width:256px;height:180px",value:EncodePair})
            );
          }else{
            return ' ';
          }
        }),
        van.derive(()=>{
          if(isWorker.val){
            return tr(
              td({colspan:2},
                label('QR Work'),
                input({type:'checkbox',checked:isDisplayQR2,oninput:e=>isDisplayQR2.val=e.target.checked})
              )
            );
          }else{
            return ' ';
          }
        }),
        van.derive(()=>{
          if(isWorker.val==true && isDisplayQR2.val == true){
            return tr(
              QRCode(EncodePair.val)
            );
          }else{
            return ' ';
          }
        }),
        van.derive(()=>{
          if(isWorker.val){
            return tr({},
              td(
                button({onclick:()=>btnWorkDownload()},'Download'),
                button({onclick:()=>copyWorkPair()},'Copy')
              )
            );
          }else{
            return ' ';
          }
        }),
        tr({},
          td(
            button({onclick:()=>btnPairSignUp()}, 'Register Pair')
          )
        ),
      )
    )
  );
}


export {
  ELSignup
}