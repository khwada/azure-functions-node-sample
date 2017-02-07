module.exports = function (context, myBlob) {

  context.log("JavaScript blob trigger function processed blob \n Name:", context.bindingData.name, "\n Blob Size:", myBlob.length, "Bytes");

  var message = {
    'conversationId': process.env.CONVERSATION_ID,
    'message': myBlob
  };

  context.bindings.outputQueueItem = JSON.stringify(message);
  context.log(message);
  context.done();
};
