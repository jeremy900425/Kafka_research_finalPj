const mqtt = require('mqtt');
const { performance } = require('perf_hooks');
const client = mqtt.connect('mqtt://localhost:1883');

const totalMessages = 100;

client.on('connect', () => {
    console.log('Connected to local MQTT broker');
    sendMessages();
    client.end();
});

function sendMessages() {
    for (let i = 0; i < totalMessages; i++) {
        const message = JSON.stringify({
            id: i + 1,
            timestamp: Date.now(),
            content: 'Test Message ' + (i + 1)
        });
        client.publish('EVENT', message, {}, (err) => {
            if (err) {
                console.error('Publish error:', err);
            } else {
                console.log(`Message ${i + 1} sent.`);
            }
        });
    }
}
