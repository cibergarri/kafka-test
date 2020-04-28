const messageType = process.argv.slice(3).shift() || 'LOW';
const kafkaPreffix = process.argv.slice(2).shift() || 'default';

module.exports = {
  messageType,
  kafkaHost: 'localhost:9092' || process.env.KAFKA_HOST,
  kafkaTopic: 'kafka-topic' || process.env.KAFKA_TOPIC,
  kafkaStreamsTopic: 'kafka-stream-topic'|| process.env.KAFKA_STREAM_TOPIC,
  kafkaPreffix,
  kafkaClientId: `${kafkaPreffix}_kafka_v1.0`,
};