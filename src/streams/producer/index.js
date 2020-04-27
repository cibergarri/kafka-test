const kafka         = require('kafka-node');
const { Transform } = require('stream');
const _             = require('lodash');

const config = require('../../config');

const {
  kafkaClientId,
  kafkaStreamsTopic,
  kafkaHost,
} = config;

const {
  ProducerStream,
} = kafka;

console.log({kafkaClientId});

const kafkaClientOptions = { kafkaHost, clientId: kafkaClientId };

const producer = new ProducerStream({ kafkaClient: kafkaClientOptions });

const stdinTransform = new Transform({
  objectMode: true,
  decodeStrings: true,
  transform (text, encoding, callback) {
    text = _.trim(text);
    console.log(`pushing message ${text} to ${kafkaClientId}-${kafkaStreamsTopic}`);
    callback(null, {
      topic: `${kafkaClientId}-${kafkaStreamsTopic}`,
      messages: text
    });
  }
});
 
process.stdin.setEncoding('utf8');
process.stdin.pipe(stdinTransform).pipe(producer);