
Start kafka in docker:

```
docker pull spotify/kafka
docker run -d  --network kafka-net -p 2181:2181 -p 9092:9092 --env ADVERTISED_HOST=kafka --env ADVERTISED_PORT=9092 --name kafka spotify/kafka
```

Optional kafka-manager
```
docker run -d -it --rm  --network kafka-net -p 9000:9000 -e ZK_HOSTS="kafka:2181" --name kafka-manager sheepkiller/kafka-manager

```

Create cluster in kafka manager:

```
curl localhost:9000/clusters --data "name=primary&zkHosts=kafka:2181&kafkaVersion=0.9.0.1" -X POST
```

Or do it manually with this values:

 - kafka cluster name -> primary
 - kafka url -> kafka:2181





start a producer for the topic with preffix 'dev'

```
npm run start dev
```
Wait until at least one message has been sent (to create the topic)

...and Start a consumer for the topic with preffix 'dev'

```
npm run consume dev
```

You can create a different preffixed consumer and producer and they will be indepedent




Create a topic (not necessary):
```
docker exec kafka /opt/kafka_2.11-0.10.1.0/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic test
```

List topics:
```
docker exec kafka /opt/kafka_2.11-0.10.1.0/bin/kafka-topics.sh --list --zookeeper localhost:2181
```


Docker info from:
https://gist.github.com/abacaphiliac/f0553548f9c577214d16290c2e751071



Known Issues:

First time you create a message in a topic you get this error:

'Could not find the leader'

Documentation advises to use this command to fix it:

kafkaClient.refreshMetadata();

