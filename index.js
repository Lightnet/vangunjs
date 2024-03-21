import fs from 'fs';
import Gun from 'gun';
import http from 'http';
import path from 'path';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
// https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules
// https://medium.com/@adrian_j_deniz/how-to-create-a-web-server-with-pure-node-js-to-serve-static-files-c53f42c6344d
const __dirname = dirname(fileURLToPath(import.meta.url));

var config = {
  port: process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || process.env.PORT || process.argv[2] || 3000,
  peers: process.env.PEERS && process.env.PEERS.split(',') || []
};

function serverHandler(request, response) {
  //console.log('request ', request.url);
  let filePath = request.url;

  if (filePath == '/') {
      filePath = 'public/index.html';
  }
  else {
      filePath = 'public' + request.url;
  }

  let extname = String(path.extname(filePath)).toLowerCase();
  let mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.wav': 'audio/wav',
      '.mp4': 'video/mp4',
      '.woff': 'application/font-woff',
      '.ttf': 'application/font-ttf',
      '.eot': 'application/vnd.ms-fontobject',
      '.otf': 'application/font-otf',
      '.wasm': 'application/wasm',
      '.ico' : 'image/x-icon'
  };

  let contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, function(error, content) {
      if (error) {
          if(error.code == 'ENOENT') {
              fs.readFile('public/404.html', function(error, content) {
                  response.writeHead(404, { 'Content-Type': 'text/html' });
                  response.end(content, 'utf-8');
              });
          }
          else {
              response.writeHead(500);
              response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
          }
      }
      else {
          response.writeHead(200, { 'Content-Type': contentType });
          response.end(content, 'utf-8');
      }
  });

}

//const server = http.createServer(Gun.serve(__dirname));
const server = http.createServer(serverHandler);
var gun = Gun({web: server.listen(config.port), peers: config.peers});
// https://stackoverflow.com/questions/50479815/handling-connect-disconnect-status-get-online-users-in-gun
// gun.on('hi', peer =>{ 
//   //console.log('HI > ',peer);
//   console.log('HI > Peer!');
// });
// gun.on('bye', peer =>{ 
//   //console.log('BYE > ',peer);
//   console.log('BYE > Peer!');
// });

//console.log('Relay peer started on port ' + config.port + ' with /gun');
//console.log('Relay http://127.0.0.1:3000');
console.log('Web: http://127.0.0.1:3000');