const kafka         = require('kafka-node');
const { Transform } = require('stream');
const _             = require('lodash');

const config = require('../../config');
const { Message } = require('../types');

const {
  messageType,
  kafkaClientId,
  kafkaStreamsTopic,
  kafkaHost,
} = config;

const {
  ProducerStream,
} = kafka;

console.log({kafkaClientId});
console.log({config});

const kafkaClientOptions = { kafkaHost, clientId: kafkaClientId };

const producer = new ProducerStream({ kafkaClient: kafkaClientOptions });

const stdinTransform = new Transform({
  objectMode: true,
  decodeStrings: true,
  transform (text, encoding, callback) {
    text = _.trim(text);
    const messages = Message.toBuffer({
      importance: messageType,
      text,
    }); 
    console.log(`pushing message ${text} to ${kafkaClientId}-${kafkaStreamsTopic}`);
    // console.log({messages});
    // console.log({ deserialized: Message.fromBuffer(messages) });
    callback(null, {
      topic: `${kafkaClientId}-${kafkaStreamsTopic}`,
      messages,
    });
  }
});
 
process.stdin.setEncoding('utf8');
process.stdin.pipe(stdinTransform).pipe(producer);