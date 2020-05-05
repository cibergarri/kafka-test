
## Start kafka in docker:

```
docker pull spotify/kafka
docker run -d \
  --network kafka-net \
  -p 2181:2181 -p 9092:9092  \
  --env ADVERTISED_HOST=localhost \  // to allow your clients to connect
  --env ADVERTISED_PORT=9092 \
  --hostname kafka \                 // to allow apps in the kafka-net to connect (kafka-manager, kafka-magic)
  --name kafka spotify/kafka
```

Create a topic (not necessary):

```
docker exec kafka /opt/kafka_2.11-0.10.1.0/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic test
```

List topics:

```
docker exec kafka /opt/kafka_2.11-0.10.1.0/bin/kafka-topics.sh --list --zookeeper localhost:2181
```
More Docker info:
https://gist.github.com/abacaphiliac/f0553548f9c577214d16290c2e751071


## (Optional) Start kafka-manager (localhost:9000)
```
docker run -d -it --rm --network kafka-net -p 9000:9000 -e ZK_HOSTS="kafka:2181" --name kafka-manager sheepkiller/kafka-manager

```

Create cluster in kafka manager:

```
curl localhost:9000/clusters --data "name=primary&zkHosts=kafka:2181&kafkaVersion=0.9.0.1" -X POST
```

Or do it manually with this values:

 - kafka cluster name -> primary
 - kafka url -> kafka:2181

## (Optional) Start kafka-magic (localhost:8080)

```
docker run -d --rm --network kafka-net -p 8080:80 -e ADV_HOST="kafka-magic" -e KMAGIC_ALLOW_TOPIC_DELETE="true" digitsy/kafka-magic
```

Connect options: 
 - cluster name: primary
 - bootstrap servers: kafka:9092

## (Optional) Start schema-registry (if you use it for managing the schemas) (localhost:5000)
From https://github.com/salsify/avro-schema-registry


Run a docker machine for postgres db
```
docker run --name avro-postgres -d \
  -e POSTGRES_PASSWORD=avro \
  -e POSTGRES_USER=avro \
  postgres:9.6
````

Within this repo cloned -> https://github.com/salsify/avro-schema-registry
Build the image:

```
docker build . -t avro-schema-registry
```

Run it
```
docker run --name avro-schema-registry --link avro-postgres:postgres -p 5000:5000 -d \
  -e DATABASE_URL=postgresql://avro:avro@postgres/avro \
  -e FORCE_SSL=false \
  -e SECRET_KEY_BASE=supersecret \
  -e DISABLE_PASSWORD=true \
  avro-schema-registry
```
Other options: 
```
  -e SCHEMA_REGISTRY_PASSWORD='avro' \ # without DISABLE PASSWORD env var
  -e AUTO_MIGRATE=1 \
```





## Run the app:

Start a producer for the topic with preffix 'dev'

### Normal:

```
npm run start dev
```
Wait until at least one message has been sent (to create the topic)

...and Start a consumer for the topic with preffix 'dev'

```
npm run consume dev
```

You can create a different preffixed consumer and producer and they will be indepedent

### Streams with AVRO serialization/deserialzation:

 - Run Producer:
```
npm run stream-producer {{preffix}}
```

 - Run Consumer-Rebalancer - (Republish topic to "Rebalance" topic )

```
npm run stream-consumer-producer {{preffix}}
```

 Run Final Consumer:

```
npm run stream-producer {{preffix}}
```


## Known Issues:

First time you create a message in a topic you get this error:

'Could not find the leader'

Documentation advises to use this command to fix it: (not managed to make it work):

kafkaClient.refreshMetadata();

