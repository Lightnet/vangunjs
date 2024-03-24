# vangunjs

# License : MIT

# Created By: Lightnet

# Information:
  Rebuild from other project for gun.js sea.js for minimal chat messages. ES6 module javascript. Working on nodejs and bun.js (N/A)

  By using the [vanjs](vanjs.org) to reduce html set up. To create user interface in javascript module browser. I use jquery before. So it almost but it has more features. One of the reason is keep the file size small but the current development it just testing the builds.

# Features:
 * UI
  * [ ] sign in (wip)
    * [x] alias (name, passphrase)
    * [x] pair (json {pub, epub, epriv, priv})
      * [x] sea work (encode (param1, param2))
      * [ ] upload file
      * [x] paste pair
      * [ ] QR Code
  * [ ] sign up (wip)
    * [x] alias (name, passphrase)
    * [x] pair (json {pub, epub, epriv, priv})
      * [x] sea work (encode (param1, param2))
      * [x] pair login
      * [x] QR Code
      * [x] download file
  * sign out (wip)
  * private message (wip)
    * [x] pub (look up for access expire graph node key)
    * [x] compose (add test)
    * [x] certify expire options
    * [ ] public message
    * [ ] private message
  * [x] account
    * [x] change passphrase
    * [x] hint
    * [ ] profile
  * [ ] group message (wip)
    * [ ] create group (wip)
    * [ ] join ( wip )
    * [ ] add ( wip )
    * [ ] delete ( wip )
    * [ ] admin ( N/A )
      * [ ] member list
      * [ ] pending access
      * [ ] encrypt key ( encode message, current public)
      * [ ] certify key (access to graph node write)
      * [ ] blacklist
      * [ ] delete ( N/A , is it possible? )

# Blacklist:
 User will have certify keys if they are blacklist unless the code use filter and custom. So there no way to delete since it snyc with peer to peer network. Only way is to build round about ways. If they manage to save before remove the only way is set up.

 Example below.
```js
  node.get('message').map().once((data,key)=>{
    //this will check alias pub key if match will ingore message.
    let isBan = node.get('blacklist').get(key).get('ban').then();//alias pub
    if(isBan){//
      return;
    }
    //...
  })
```
  Note it will query and will use power a bit. I think. Well there are different way to handle I think.

# File size:
 Current in development build.

## Support size:
 * jquery-3.7.1.min.js 86 kB.
 * VanJS-1.5.0  2 kB
   * van-ui
   * van-x

# Refs / GitHub / Links:
 * https://vanjs.org
 * https://vanjs.org/#community-add-ons
 * https://github.com/amark/gun 
 * https://github.com/Atmos4/van-element
 * https://github.com/vanjs-org/van/discussions/257

# Notes:
 * Keep it simple.

## Create pair user:
```js
var pair = await Gun.SEA.pair();
const gunInstance = Gun(location.origin+"/gun");
gunInstance.user().auth(pair, async function(ack){
  console.log(ack);
  let node = await gunInstance.user().then();
  console.log(node); //by default empty graph
});
```
 Reason for empty is for easy to develop graph as example chat room setup node graph. It need to verfity pair key to access check node links with other pair when write other pair graph with certs.

 Down side is user must secure their pair keys offline.
## Create user:

```js
const gunInstance = Gun(location.origin+"/gun");
gunInstance.user().create("alias", "passphrase", function(ack){
  // done creating user!
  console.log(ack);
  //does not return graph since it is register
});
```

```js
const gunInstance = Gun(location.origin+"/gun");
gunInstance.user().auth("alias", "passphrase", async function(ack){
  console.log(ack);
  if(ack.err){
    console.log("BAD LOGIN");
    return;
  }
  let node = await gun.user().then();
  console.log("node: ",node);
  //alias
  //auth
  //epub
  //pub
});
```