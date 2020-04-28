
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
  ProducerStream,
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

const kafkaClientOptions = { kafkaHost, clientId: kafkaClientId };

// to avoid BrokerNotAvailableError: Could not find the leader Error on first message
// kafkaClient.refreshMetadata();
const resultProducer = new ProducerStream({ kafkaClient: kafkaClientOptions });
const consumerGroup = new ConsumerGroupStream(consumerOptions, `${kafkaClientId}-${kafkaStreamsTopic}`);
 
const messageTransform = new Transform({
  objectMode: true,
  decodeStrings: true,
  transform (message, encoding, callback) {
    const buffer = Buffer.from(message.value, 'binary'); // Read string into a buffer.
    const msg = Message.fromBuffer(buffer.slice(0)); // Skip prefix.
    console.log(`Received message ${JSON.stringify(msg)} -> transforming input`);
    msg.text = `You have received and rebalanced this message: ${msg.text}`;
    callback(null, {
      topic: `${kafkaClientId}-Rebalance-${kafkaStreamsTopic}`,
      messages: Message.toBuffer(msg),
    });
  }
});
 
consumerGroup.pipe(messageTransform).pipe(resultProducer);