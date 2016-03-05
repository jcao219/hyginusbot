var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

function respond() {
  var thing = this.req.chunks.join("");
  var request;
  try {
    request = JSON.parse(thing);
  } catch (e) {
    console.log("!! !! Something bad was sent to me.");
    console.log(thing);
    console.log(e.message);
    this.res.writeHead(200);
    this.res.end();
    return;
  }
  var botRegex = /^\/cool guy$/;
  var whoamiRegex = /^\/mrhyginus$/;

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage("");
    this.res.end();
  } else if(request.text && whoamiRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage("I am just the coolest!");
    this.res.end();
  } else if (request.ref) {
    this.res.writeHead(200);
    var msg = "";
    msg += request.pusher.name;
    msg += " pushed to ";
    msg += request.ref;
    var commitMsgs = request.commits.map(
      function(x){ return x.message; });
    msg += " commits with these messages: \""
    msg += commitMsgs.join("\", \"");
    msg += "\"";
    postMessage(msg);
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(s) {
  var botResponse, options, body, botReq;

  if(s)
    botResponse = s;
  else
    botResponse = cool();

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
