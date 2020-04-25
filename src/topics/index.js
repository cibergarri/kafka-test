
const kafka = require("kafka-node");
 
const config = require('../config');
const {
  kafkaHost,
} = config;

const client = new kafka.KafkaClient({kafkaHost});
const admin = new kafka.Admin(client);
admin.listTopics((err, res) => {
  console.log('topics', JSON.stringify(res,null, 2));
});