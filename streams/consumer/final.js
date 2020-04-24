
const kafka = require("kafka-node");
const { Transform } = require('stream');
 
const config = require('../config');

const {
  kafkaClientId,
  kafkaTopic,
  kafkaHost,
} = config;

const {
  ConsumerGroupStream,
} = kafka;

const consumerOptions = {
  kafkaHost,
  groupId: 'ExampleRebalancedTestGroup',
  sessionTimeout: 15000,
  protocol: ['roundrobin'],
  asyncPush: false,
  id: 'consumer2',
  fromOffset: 'latest'
};
const consumerGroup = new ConsumerGroupStream(consumerOptions, `Rebalance-${kafkaTopic}`);
 
const messageTransform = new Transform({
  objectMode: true,
  decodeStrings: true,
  transform (message, encoding, callback) {
    console.log(`Received rebalanced message ${message.value}`);
  }
});
 
consumerGroup.pipe(messageTransform);
