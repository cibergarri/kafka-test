
const kafka = require("kafka-node");
const { Transform } = require('stream');
 
const config = require('../config');

const {
  kafkaClientId,
  kafkaTopic,
  kafkaHost,
} = config;

const {
  ProducerStream,
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

console.log({kafkaHost});
console.log({kafkaClientId});

const kafkaClientOptions = { kafkaHost, clientId: kafkaClientId };

// to avoid BrokerNotAvailableError: Could not find the leader Error on first message
// kafkaClient.refreshMetadata();
const resultProducer = new ProducerStream({ kafkaClient: kafkaClientOptions });
const consumerGroup = new ConsumerGroupStream(consumerOptions, `${kafkaClientId}-${kafkaTopic}`);
 
const messageTransform = new Transform({
  objectMode: true,
  decodeStrings: true,
  transform (message, encoding, callback) {
    console.log(`Received message ${message.value} -> transforming input`);
    callback(null, {
      topic: `${kafkaClientId}-Rebalance-${kafkaTopic}`,
      messages: `You have received and rebalanced this message: (${message.value})`
    });
  }
});
 
consumerGroup.pipe(messageTransform).pipe(resultProducer);