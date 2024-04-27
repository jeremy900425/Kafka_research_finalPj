const mqtt = require('mqtt');
const { performance } = require('perf_hooks');
const client = mqtt.connect('mqtt://localhost:1883');

let latencySum = 0;
let messageCount = 0;
const totalMessages = 3000;

client.on('connect', () => {
    console.log('Connected to local MQTT broker and subscribing to EVENT');
    client.subscribe('EVENT');
});

client.on('message', function (topic, message) {
    if (topic === 'EVENT') {
        const receivedMsg = JSON.parse(message.toString());
        const endTime = Date.now();
        // console.log(endTime);
        // console.log(receivedMsg.timestamp);
        const latency = endTime - receivedMsg.timestamp;
        latencySum += latency;
        messageCount++;
        console.log(`Received Message ${receivedMsg.id} with latency: ${latency.toFixed(2)} ms`);

        if (messageCount === totalMessages) {
            const averageLatency = latencySum / totalMessages;
            console.log(`Average Latency: ${averageLatency.toFixed(2)} ms`);
        }
    }
});

//依序：3000 83.78ms
//依序：30000 277.04ms