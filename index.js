const Alexa = require("ask-sdk-core");
const https = require('https');

function httpGet() {
  return new Promise(((resolve, reject) => {
    let options = {
      host: 'pmasterbot.herokuapp.com',
      'port': 443,
      'path': '/quotes',
      'mothod': 'GET'
    }
    const request = https.request(options, (response) => {
      response.setEncoding('utf-8');
      let returnData = '';
      response.on('data', (chunk) => {
        returnData += chunk;
      });
      response.on('end', () => {
        resolve(JSON.parse(returnData));
      });
      response.on('error', (error) => {
        reject(error);
      });
    });
    request.end();
  }));
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  async handle(handlerInput) {
    const response = await httpGet();
    const speechText = `Frase celebre de ${response[1].name}, ${response[1].quote}`
    return handlerInput.responseBuilder.speak(speechText).getResponse();
  }
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(LaunchRequestHandler)
  .lambda();
