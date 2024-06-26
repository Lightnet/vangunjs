/*
  Project Name: vangunjs
  License: MIT
  Created By Lightnet
  Type: Javascript Module
*/

// https://stackoverflow.com/questions/11893083/convert-normal-date-to-unix-timestamp
// parseInt((new Date('2012.08.10').getTime() / 1000).toFixed(0))
function unixTime(){
  return parseInt((new Date().getTime() / 1000).toFixed(0))
}
//match with the Gun.state() = time for expire date cert
function gunUnixTime(){
  return parseInt(new Date().getTime() )
}

// https://www.tutorialrepublic.com/faq/how-to-convert-a-unix-timestamp-to-time-in-javascript.php
// https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
function unixToDate(_num){
  return new Date(_num * 1000).toLocaleString();
  //return new Date(_num).toLocaleString();
}

function gunUnixToDate(_num){
  //return new Date(_num * 1000).toLocaleString();
  return new Date(_num).toLocaleString();
  //let dateTime = new Date(_num);
  //let hours = dateTime.getHours() % 12 || 12;
  //let newTime  =  dateTime.getFullYear()+ "/" + dateTime.getMonth() + "/" + dateTime.getDate() + " " +  hours + ":" + dateTime.getMinutes()+ ":" + dateTime.getSeconds();
  //return newTime;
}

export {
  unixTime,
  unixToDate,
  gunUnixToDate,
  gunUnixTime
}