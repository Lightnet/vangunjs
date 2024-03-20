// for public and private group message

import {van} from '/dps.js';
import '/van-ui.nomodule.min.js';
const {
  button,
  div, 
  label,
  select,
  option,
  input,
  p
} = van.tags;

console.log(Modal);

const ElGroupMessage = ()=>{
  const closed = van.state(true);
  const view = van.state('lobby');

  function callAPI(data){
    console.log(data)
    if(data?.action=='join'){
      view.val = 'room';
    }
    if(data?.action=='leave'){
      view.val = 'lobby';
    }
  }

  const viewRender = van.derive(()=>{
    if(view.val == 'lobby'){
      return ELGroupMessageMenu({api:callAPI});
    }
    if(view.val == 'room'){
      return ELGroupMessageRoom({api:callAPI});
    }
  })

  van.add(document.body, Modal({closed},
    p("Hello, World!"),
    div({style: "display: flex; justify-content: center;"},
      button({onclick: () => closed.val = true}, "Ok"),
    ),
  ));


  return div(
    viewRender
  );
}

const ELGroupMessageMenu =({api})=>{

  function btnJoin(){
    api({action:"join"})
  }

  return div(
    div(
      label("Group Public Keys:"),
      select({style:"width:256px;"}),
      input(),
      button({onclick:()=>btnJoin()},'Join'),
      button('Add'),
      button('Delete'),
      button('Options')
    )
  );
}

const ELGroupMessageRoom =({api})=>{

  function callLeave(){
    api({action:'leave'})
  }

  return div(
    div(
      label("Public Key:"),
      label("0000"),
      button({onclick:()=>callLeave()},'Leave'),
    ),
    div(

    ),
    div(
      input(),
      button({},'Sent')  
    )
  )
}


export {
  ElGroupMessage
}