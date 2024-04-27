const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'producer-client',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

const produceMessages = async () => {
  await producer.connect();
  const promises = [];
  try {
    for (let i = 0; i < 30000; i++) {
      const message = {
        value: JSON.stringify({ key: 'value', timestamp: Date.now() })
      };
      promises.push(producer.send({
        topic: 'test_topic',
        messages: [message],
      }));
    }
    await Promise.all(promises);
    console.log('All messages sent successfully');
  } catch (err) {
    console.error('Failed to send message', err);
  } finally {
    await producer.disconnect();
  }
};

produceMessages();

// 並發3000：306.60ms
// 並發30000：2495.43ms