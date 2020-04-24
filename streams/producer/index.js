const kafka         = require("kafka-node");
const { Transform } = require('stream');
const _             = require('lodash');

const config = require('../config');

const {
  kafkaClientId,
  kafkaTopic,
  kafkaHost,
} = config;

const {
  KafkaClient: Client,
  ProducerStream,
} = kafka;

const kafkaClient = new Client({kafkaHost});
const producer = new ProducerStream(kafkaClient);

const stdinTransform = new Transform({
  objectMode: true,
  decodeStrings: true,
  transform (text, encoding, callback) {
    text = _.trim(text);
    console.log(`pushing message ${text} to ${kafkaTopic}`);
    callback(null, {
      topic: kafkaTopic,
      messages: text
    });
  }
});
 
process.stdin.setEncoding('utf8');
process.stdin.pipe(stdinTransform).pipe(producer);