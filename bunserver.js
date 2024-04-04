//TEST
//does not work since socket and different req and rep. bun use fetch style.
//bun 1.1

var public_path = "public"; //folder

function fetch(req, server) {
  const success = server.upgrade(req);
  console.log("success: ",success)
  if (success) {
    // Bun automatically returns a 101 Switching Protocols
    // if the upgrade succeeds
    return undefined;
  }

	//console.log('URL: ' + req.url)
	let filePath = new URL(req.url).pathname;
	console.log('path: ' + filePath);
	if (filePath == '/') {
		filePath = public_path+'/index.html'
		const file = Bun.file(filePath);
		return new Response(file);
	} else {
    if(filePath == "/favicon.ico"){
      
    }
		filePath = public_path + filePath;
		const file = Bun.file(filePath);
		return new Response(file);
	}
}

const server = Bun.serve({
	fetch: fetch,
  // https://bun.sh/guides/websocket/pubsub
  // https://bun.sh/guides/websocket/compression
  websocket: {
    // this is called when a message is received
    async message(ws, message) {
      console.log(`Received ${message}`);
      // send back a message
      //ws.send(`You said: ${message}`);
    },
    open(ws) {
      console.log("open")
    }, // a socket is opened
    close(ws, code, message) {
      console.log("close")
    }, // a socket is closed
    drain(ws) {
      console.log("drain")
    }, // the socket is ready to receive more data

  },
	port: 1337
})

console.log('Server is running on port 1337!')
//console.log(server)
// const gun = Gun({
// 	web: server
// })
//console.log(gun);
console.log(`Listening on http://${server.hostname}:${server.port}`)
