
const kafka = require("kafka-node");
const { Transform } = require('stream');
 
const config = require('../config');

const {
  kafkaClientId,
  kafkaTopic,
  kafkaHost,
} = config;

const {
  KafkaClient: Client,
  ProducerStream,
  ConsumerGroupStream,
} = kafka;

const consumerOptions = {
  kafkaHost,
  groupId: 'ExampleTestGroup',
  sessionTimeout: 15000,
  protocol: ['roundrobin'],
  asyncPush: false,
  id: 'consumer1',
  fromOffset: 'latest'
};

const kafkaClient = new Client({kafkaHost});
const resultProducer = new ProducerStream(kafkaClient);
const consumerGroup = new ConsumerGroupStream(consumerOptions, kafkaTopic);
 
const messageTransform = new Transform({
  objectMode: true,
  decodeStrings: true,
  transform (message, encoding, callback) {
    console.log(`Received message ${message.value} -> transforming input`);
    callback(null, {
      topic: `Rebalance-${kafkaTopic}`,
      messages: `You have received and rebalanced this message: (${message.value})`
    });
  }
});
 
consumerGroup.pipe(messageTransform).pipe(resultProducer);