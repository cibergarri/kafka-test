
const kafka = require("kafka-node");
const { Transform } = require('stream');
 
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
    console.log(`Received rebalanced message ${message.value}`);
    callback()
  }
});
 
consumerGroup.pipe(messageTransform);
