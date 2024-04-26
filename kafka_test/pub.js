const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'producer-client',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

const produceMessages = async () => {
  await producer.connect();
  try {
    const message = {
      value: JSON.stringify({ key: 'value', timestamp: Date.now() })
    };
    
    await producer.send({
      topic: 'test_topic',
      messages: [message],
    });
    for (let i = 0; i < 100; i++) {
      await producer.send({
        topic: 'test_topic',
        messages: [message],
      });
    }
    
    console.log('Message sent successfully');
  } catch (err) {
    console.error('Failed to send message', err);
  } finally {
    await producer.disconnect();
  }
};

produceMessages();
