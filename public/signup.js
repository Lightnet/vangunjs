import {van} from '/dps.js';

import { AppContext, gunState } from '/context.js';
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
  const alias = van.state("");
  const passphrase = van.state("012345678");
  const gun = AppContext.gun.val;

  console.log(AppContext.version.val);

  function login(){
    //console.log(versionState.val)
    const gun = gunState.val;
    const user = gun.user();
    user.create(alias.val, passphrase.val, function(ack){
      // done creating user!
      console.log(ack);
    });
  }

  function Cancel(){
    //console.log()
    AppContext._version.val = "ts"
    AppContext._alias.val = "ges"
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
            button({onclick:()=>login()},'Register'),      
          ),
          td(
            button({onclick:()=>Cancel()},'Cancel'),
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

  const pairKey = van.state(null);
  const isWorker = van.state(true);

  const div_qr = div();

  async function generatePair(){
    var pair = await Gun.SEA.pair()
    console.log(pair);
    div_qr.innerText = '';

    pairKey.val = JSON.stringify(pair);
    van.add(div_qr, QRCode(pairKey.val));
  }

  function btndownload(){

    //download('seapair.txt', pairKey.val);
    save('seapair.txt', pairKey.val);
  }

  async function copyPair(){
    try {
      await navigator.clipboard.writeText(pairKey.val);
      console.log('Content copied to clipboard');
      /* Resolved - text copied to clipboard successfully */
    } catch (err) {
      console.error('Failed to copy: ', err);
      /* Rejected - text failed to copy to the clipboard */
    }
  }

  function btnPairSignUp(){
    const gun = gunState.val;
    const user = gun.user();
    user.create(JSON.parse(pairKey.val), function(ack){
      // done creating user!
      console.log(ack);
    });
  }

  return div(
    table(
      tbody(
        tr(
          td({colspan:2},
            label('Worker'),
            input({type:'checkbox'})
          )
        ),
        tr(
          td({colspan:2},
            label('base64'),
            input({type:'checkbox'})
          )
        ),
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
        tr(
          td({colspan:2},
            div_qr
          )
        ),
        tr({},
          td(
            button({onclick:()=>btndownload()},'Download'),
            button({onclick:()=>copyPair()},'Copy')
          ),
          td(
            button({onclick:()=>btnPairSignUp()}, 'Register Pair')
          )
        )
      )
    )
  );
}


export {
  ELSignup
}