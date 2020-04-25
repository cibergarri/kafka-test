const kafka = require('kafka-node');

const config = require('../config')
const {
  Consumer,
  KafkaClient: Client,
} = kafka

// get preffix from argument
const preffix = process.argv.slice(2).pop() || 'def';

const client = new Client({kafkaHost: config.kafkaHost });
// to avoid BrokerNotAvailableError: Could not find the leader Error on first message
client.refreshMetadata();

const fetchRequests = [{
  topic: `${preffix}-${config.kafkaTopic}`,
  partition: 0,
}];
const options = { autoCommit: false };
const consumer = new Consumer(client, fetchRequests, options);

consumer.on("message", function(message) {
  console.log(message);
  
/** { topic: 'kafka-topic', value: 'This is the message 385 consumed for the preffix', offset: 412, partition: 0, highWaterOffset: 413, key: null } */

});