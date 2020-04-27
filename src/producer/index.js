const kafka = require("kafka-node");

const config = require('../config')

const {
  Producer,
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
const producer = new Producer(client);

let count = 0;

producer.on("ready", function() {
  console.log("ready");
  setInterval(function() {
    payloads = [
      { topic: `${kafkaPreffix}-${kafkaTopic}`, messages: `This is the message ${count} consumed for the preffix ${kafkaPreffix}`, partition: 0 }
    ];

    producer.send(payloads, function(err, data) {
      console.log(data);
      count += 1;
    });
  }, 5000);
});

producer.on("error", function(err) {
  console.log(err);
});
