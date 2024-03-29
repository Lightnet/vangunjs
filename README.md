# vangunjs

# License : MIT

# Created By: Lightnet

# Links:
 * https://github.com/amark/gun

# Information:
  Rebuild from other project for gun.js sea.js for minimal chat messages. ES6 module javascript. Working on nodejs and bun.js (N/A)

  By using the [vanjs](vanjs.org) to reduce html set up. To create user interface in javascript module browser. I use jquery before. So it almost but it has more features. One of the reason is keep the file size small but the current development it just testing the builds.

# Private Message:
 Note this is my own understanding a bit. It might right and wrong. Which require some testing.

 Note that the SEA.pair() keys, SEA.certify() and Gun() graph nodes are handle in javascript query link chains nodes. 
 
 Gun Script has built in nodes for key and value system. Just like database but use different way a bit. There is "_" and "#" those I think are for pathing id and time stamp for key last time it change variable. To handle ref id node to get and put data for value.

 Is there way to delete those key value and the answer is yes and no as there is add on I think. But the righ answer is no. Since it peer to peer network as it restore data. The only way is to change the data is to null it. Since it check key if there change in value.

 There are add ons for the Gun.js.

 SEA Script is for auth for secure node in gun to prevent override node without permission for those who own them. But there is cert function to allow write node pair on someone node pair.
 
 You think of the island not connect to other user unless they talk to each other with passport or agreement with the person to person for meeting. They would share some information or set up inventory list and compare what to sell or buy items. Those data must match in some ways.

 There are user has some basic alias and keys expose when created with alias and passphrase. Without the register user just pair node without graph is assign empty room but has pub key store in gun database node. Each has it pro and cons. To create pair keys that has 4 keys.
```js
let Alias_PAIR = {
  pub:"000.000",
  priv:"000",
  epub:"000.000",
  epriv:"000"
}
```
  Please read from gun docs for more information. Only two variables are expose when creating the user name account node is pub and epub for creating messsage and look up.

 The user can create pair and alias but depend on the setup.

```js
import 'https://cdn.jsdelivr.net/npm/gun/gun.js';
import 'https://cdn.jsdelivr.net/npm/gun/sea.js';
//var gun = GUN("http://127.0.0.1:3000/gun");
//var gun = GUN();
var gun = Gun();
gun.user().create("pair")  // for alias, pub and epub
gun.user().create("alias","passphrase") // for alias, pub and epub
gun.user().auth("pair") // for empty graph use as room
```
  The user has to auth in gun graph node. One reason is to register the data to gun graph node to query the key and value nodes.

  Creating the certify. Is easy and hard. User need to store cert if other user wanted to messages people to see it. Read more on gun docs on SEA API.
 
```js
let expireTime = Gun.state() + (60*60*25*1000); // Let's set a one day expiration 

const cert = await Gun.SEA.certify( 
  '*',  // everybody is allowed to write, public key
  { '*':'privatemessage', '+': '*' }, // to the path that starts with 'privatemessage' and along with the key has the user's pub in it
  user._.sea, //authority PAIR Keys
  null, //no need for callback here
  { expiry: expireTime }
);
//need to be login to put data into the current user.
gun.user()
    .get('certs')
    .get('privatemessage')
    .put(cert);

```
 Which required permission for user to write their pub key with certify to their on pub key node as example message. 
```js
// current login alias = pair 
// to = pair only pub and epub access look up
// to is for sending message which required current sea pair key just pub.
const cert = await gun.user("to pub key")
                          .get('certs')
                          .get('privatemessage').then();
let message = "hello world";
gun.user("to pub key")
  .get("message")
  .get('current login public key')
  .get('date')
  .put(message,null, {opt:{cert:cert}});
```
  Note this without much encrypted but public message expose.

# Gun

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
    * [x] private message
  * [x] account
    * [x] change passphrase
    * [x] hint
    * [ ] profile
  * [ ] group message (wip)
    * [x] create group (wip)
    * [x] join ( wip )
    * [x] add ( wip )
    * [x] delete ( wip )
    * [x] public messages ( added)
    * [x] encode messages ( )
    * [ ] admin ( wip )
      * [x] member list
         * [x] grant access
         * [ ] revoke access
         * [ ] ban access
      * [x] certify (public and private access graph node write)
        * [x] pending for register pub key for access (wip)
          * [x] approve
          * [x] reject
        * [x] message pulbic for pub key (wip)
      * [ ] encrypt key ( encode message )
      * [ ] blacklist
      * [ ] delete ( N/A , is it possible? )

# Blacklist:
 User will have certify keys if they are blacklist. It would required to set up blacklist node and code filter when doing map event call. As long there is expire date and user must maintain certs to not to expire. So there no way to delete since it sync with peer to peer network. Reason no delete is that node will restore it self if peer to peer. It can be only change in the node. The admin (sea pair node owner access) would revoke certify current room graph or change the expire date. If they manage to save before remove the only way is set up.

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