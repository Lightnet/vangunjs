# vangunjs

# License : MIT

# Created By: Lightnet

# Links:
 * https://github.com/amark/gun

# Information:
  Work in progress build.

  The project is broken up into components, routers and pages for easy modified those layout. Since the gun.js, sea.js and base graph node for peer to peer database. So no one own the server but peer to peer.

  Think of block chain but using the key, value and graph nodes. As it does not differentiation who own the data or server. By using the SEA.js = Security, Encryption, & Authorization on top of gun.js database graph.

  Build test for chat messages. ES6 module javascript. Working on nodejs and bun.js (N/A)

  By using the [vanjs](vanjs.org) to reduce html set up. To create user interface in javascript module browser. Used jquery before as does help but it different methods. So it almost but it has more features. One of the reason is keep the keep it simple to development and easy to understand. It is just testing the builds.

# Gun.js Database graph node:
  Gun Graph database. One is server and other client. As features of graph node, key and value. Read more on this site link. https://gun.eco/docs/RAD One reason is reduce data size.

# Security, Encryption, & Authorization - SEA.js:
  This added layer on gun graph node. It will loop throught those nodes to make those keys are vaild user who own and write the data. With the certify it would be easy to handle write permission. Note it take time to process the data.

# Private Message:
 Note this is my own understanding a bit. It might right and wrong. Which require some testing.

 Note that the SEA.pair() keys, SEA.certify() and Gun() graph nodes are handle in javascript query link chains nodes. Meaning that gun (database) and sea (auth) will check the link graph nodes to make sure it cert by the user pair keys.
 
 Gun Script has built in nodes for key and value system. As well the peer to peer network. Just like database but use different way a bit. There is "_" and "#" those I think are for pathing id and time stamp for key last time it change variable. To handle ref id node to get and put data for value. As well trigger events for sync to peer to peer value change to other peer to see if node is link their events. It reason it change real time variable or value change that put data into the graph node system. For example user online status change variable. It will alert other users who follow public key. There is video and site demo on github for gun.js.

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
//need to be login to put data into the current user. It can be store or not. Required more scripting.
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
  .get('date') // goes by format or int number
  .put(message,null, {opt:{cert:cert}});
```
  Note this without much encrypted but public message expose. But the SEA has feature that use is Elliptic-curve Diffie–Hellman.

```js
var alice = await SEA.pair();
var bob = await SEA.pair();

// alice
var sec = await SEA.secret(bob.epub, alice); //<- handle different from two pair that is trusted
var enc = await SEA.encrypt('shared data', sec);

// bob
var sec2 = SEA.secret(alice.epub, bob);//<- handle different from two pair that is trusted
var msg = await SEA.decrypt(enc, sec2);
console.log(msg);
```
  As log the key that expose pub and epub to encode and decode the data. But the other keys should not be expose to anyone.

  https://gun.eco/docs/SEA

# Group Message:
  It is tricky to set up group message since it need pair keys to talk to group of users. As well write permission with cert permits.

  If there another user join without permission they can view graph nodes. But they can't decode without the keys or post.

  There current couple ways.

  One there is public without encrypted.

  Two there is pair encrypted. By using the different key in two pairs. But it compromise if pair is take over by someone else.

  Three there is share key encrypted. In case the pair compromise.
  
  Don't forget about the SEA.certify(). It never set the expire date to none.

# Features:
 * UI
  * [ ] sign in (wip)
    * [x] alias (name, passphrase)
    * [x] pair (json {pub, epub, epriv, priv})
      * [x] sea work (encode (param1, param2))
      * [ ] upload file ?
      * [x] paste pair
      * [ ] QR Code ?
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
    * [x] public message using just pairs
    * [ ] private message layers
  * [x] account
    * [x] change passphrase
    * [x] set hint base work 2 parameters.
    * [ ] profile
    * [x] forgot passphrase hint
  * [x] group message (wip)
    * [x] create group (wip)
    * [x] join ( wip )
    * [x] add ( wip )
    * [x] delete ( wip )
    * [x] public messages ( added)
    * [x] encode messages ( )
    * [ ] admin ( wip )
      * [x] member list
         * [x] grant access
         * [x] revoke access
         * [ ] cert nodes
      * [x] certify (public and private access graph node write)
        * [x] pending for register pub key for access (wip)
          * [x] approve
          * [x] reject
        * [x] message pulbic for pub key (wip)
      * [ ] encrypt key ( encode message )
      * [ ] delete ( N/A , is it possible? ) ?

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
 * gun once event not turn off listen.
 * leak gunInstance.

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

# Set up and Run:

Set up packages by command line. Note you need to install nodejs.
```
npm install
```

Run server.
```
npm run dev
```