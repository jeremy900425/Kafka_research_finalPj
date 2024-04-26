const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'consumer-client',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({
  groupId: 'test-group',
  fromBeginning: true  // 等同於在 KafkaJS 中設置 auto.offset.reset 為 'earliest'
});


const consumeMessages = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'test_topic', fromBeginning: true });

  let count = 0;
  let totalDelay = 0;

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const receivedMsg = JSON.parse(message.value.toString());
      const delay = Date.now() - receivedMsg.timestamp;
      console.log({
        partition,
        count: count,
        value: receivedMsg.key,
        delay: `${delay}ms`
      });

      count++;
      totalDelay += delay;

      if (count === 100) {
        console.log(`Average delay: ${totalDelay / count}ms`);
      }
    },
  });
};

consumeMessages();
