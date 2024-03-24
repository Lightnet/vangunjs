# vangunjs

# License : MIT

# Information:
  Rebuild from other project for gun.js sea.js for minimal chat messages. ES6 module javascript.

  Working on nodejs and bun.js (N/A)

# Features:
 * UI
  * [] sign in (wip)
    * [x] alias (name, passphrase)
    * [x] pair (json {pub, epub, epriv, priv})
      * [x] sea work (encode (param1, param2))
      * [x] download file
      * [x] paste pair
      * [] QR Code
  * [] sign up (wip)
    * [x] alias (name, passphrase)
    * [x] pair (json {pub, epub, epriv, priv})
      * [x] sea work (encode (param1, param2))
      * [x] pair login
      * [x] QR Code
      * [] download file
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
    * [] profile
  * [] group message (wip)
    * [] create group (wip)
    * [] join ( wip )
    * [] admin ( N/A )
      * [] member list
      * [] pending access
      * [] encrypt key ( encode message, current public)
      * [] certify key (access to graph node write)
      * [] blacklist 

# File size:
 Current in development build.

## Support size:
 * jquery-3.7.1.min.js 86 kB.
 * VanJS-1.5.0  2 kB
   * van-ui
   * van-x

# Links:
 * https://vanjs.org
 * https://github.com/amark/gun

# GitHub / Links:
 * https://vanjs.org/#community-add-ons
 * https://github.com/Atmos4/van-element
 * 

# Refs:
 * https://github.com/vanjs-org/van/discussions/257

# Notes:

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