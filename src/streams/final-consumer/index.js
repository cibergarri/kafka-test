
const kafka = require("kafka-node");
const { Transform } = require('stream');
 
const { Message } = require('../types');
const config = require('../../config');

const {
  kafkaClientId,
  kafkaStreamsTopic,
  kafkaHost,
} = config;

const {
  ConsumerGroupStream,
} = kafka;

const consumerOptions = {
  encoding: 'buffer',
  kafkaHost,
  groupId: kafkaClientId,
  sessionTimeout: 15000,
  protocol: ['roundrobin'],
  asyncPush: false,
  id: kafkaClientId,
  fromOffset: 'latest'
};

console.log({kafkaClientId});

const consumerGroup = new ConsumerGroupStream(consumerOptions, `${kafkaClientId}-Rebalance-${kafkaStreamsTopic}`);
 
const messageTransform = new Transform({
  objectMode: true,
  decodeStrings: true,
  transform (message, encoding, callback) {
    const buffer = Buffer.from(message.value, 'binary'); // Read string into a buffer.
    const msg = Message.fromBuffer(buffer.slice(0)); // Skip prefix.
    console.log(`Received rebalanced message ${JSON.stringify(msg.text)}`);
    callback()
  }
});
 
consumerGroup.pipe(messageTransform);
