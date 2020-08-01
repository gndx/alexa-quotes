const Alexa = require("ask-sdk-core");
var https = require('https');

function httpGet() {
  return new Promise(((resolve, reject) => {
    var options = {
      host: 'pmasterbot.herokuapp.com/quotes',
      port: 443,
      path: '/quotes',
      method: 'GET',
    };
    const request = https.request(options, (response) => {
      response.setEncoding('utf8');
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

    const speechText = "Hola, soy Master Bot";
    const response = await httpGet();
    const mensage = `frase celebre de  ${response[0].name}, ${response[0].quote}`;

    return handlerInput.responseBuilder.speak(message).getResponse();
  }
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(LaunchRequestHandler)
  .lambda();
