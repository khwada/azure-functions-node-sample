var querystring = require('querystring');
var RestClient = require('node-rest-client').Client;
var client = new RestClient();

module.exports = function (context, myQueueItem) {
  getAccessToken()
    .then(function(accessToken){
      return sendMessage(accessToken, myQueueItem);
    })
    .then(function(){
      context.done();
    });

  function getAccessToken() {
    return new Promise(function(resolve, reject){
      context.log("get access_token...");
      var post_data = querystring.stringify({
        'grant_type': 'client_credentials',
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET,
        'scope': 'https://graph.microsoft.com/.default'
      });
      client.post("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
        headers: {
	  'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: post_data
      }, function(data, response) {
        var accessToken = data["access_token"];
        if (!accessToken || accessToken === "") {
	  context.log("failure to get the access_token");
	  process.exit(1);
        }
        context.log("success get access_token");
        resolve(accessToken);
      }).on('error', function (err) {
        context.log('something went wrong on the request', err);
      });
    });
  }

  function sendMessage(accessToken, text) {
    return new Promise(function(resolve, reject){
      context.log("send message...");
      context.log(text);
      client.post("https://api.skype.net/v3/conversations/${id}/activities/", {
        path: {
	  'id' : text['conversationId']
        },
        headers: {
	  'Accept': 'application/json',
	  'Content-Type': 'application/json',
	  'Authorization' : 'Bearer ' + accessToken
        },
        data: {
	  'type': 'message/text',
	  'text': text['message']
        }
      }, function(data, response) {
        if (response.statusCode >= 300) {
	  context.log('error when send message, status code: ' + response.statusCode);
	  context.log(data);
	  process.exit(1);
        }
        context.log("success send message");
        resolve();
      }).on('error', function (err) {
        context.log('error when send message', err);
      });
    });
  }
};
