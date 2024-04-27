const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');

const totalMessages = 3000;

client.on('connect', () => {
    console.log('Connected to local MQTT broker');
    sendMessages().then(() => {
      console.log('All messages sent');
      client.end();
    }).catch(err => {
      console.error('Error sending messages:', err);
    });
});

function sendMessages() {
    const promises = [];
    for (let i = 0; i < totalMessages; i++) {
        const message = JSON.stringify({
            id: i + 1,
            timestamp: Date.now(),
            content: 'Test Message ' + (i + 1)
        });
        promises.push(new Promise((resolve, reject) => {
            client.publish('EVENT', message, {}, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        }));
    }
    return Promise.all(promises);
}

// 並發3000：57.39ms
// 並發30000：330.79ms