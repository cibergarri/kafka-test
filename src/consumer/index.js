const kafka = require('kafka-node');

const config = require('../config')

const {
  Consumer,
  KafkaClient: Client,
} = kafka

const {
  kafkaPreffix,
  kafkaHost,
  kafkaTopic
} = config;

const client = new Client({ kafkaHost });

// to avoid BrokerNotAvailableError: Could not find the leader Error on first message
// client.refreshMetadata();

const fetchRequests = [{
  topic: `${kafkaPreffix}-${kafkaTopic}`,
  partition: 0,
}];
const options = { autoCommit: false };
const consumer = new Consumer(client, fetchRequests, options);

consumer.on("message", function(message) {
  console.log(message);
});