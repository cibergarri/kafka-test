const kafkaPreffix = process.argv.slice(2).pop() || 'default';

module.exports = {
  kafkaHost: 'localhost:9092' || process.env.KAFKA_HOST,
  kafkaTopic: 'kafka-topic' || process.env.KAFKA_TOPIC,
  kafkaStreamsTopic: 'kafka-stream-topic'|| process.env.KAFKA_STREAM_TOPIC,
  kafkaPreffix,
  kafkaClientId: `${kafkaPreffix}_kafka_v1.0`,
};