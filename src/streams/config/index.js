
const preffix = process.argv.slice(2).pop() || 'def';
module.exports = {
  kafkaTopic: 'kafka-stream-topic',
  kafkaClientId: `${preffix}_kafka_v1.0`,
  kafkaHost: 'localhost:9092',
}