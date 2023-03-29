const amqp = require('amqplib');
const config = require('../../utils/config/config');

const ProducerService = {
    sendMessage: async (queue, message) => {
        const connection = await amqp.connect(config.rabbitMq.host);
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, {
            durable: true,
        });

        channel.sendToQueue(queue, Buffer.from(message));
        setTimeout(() => {
            connection.close();
        }, 1000);
    },
};

module.exports = ProducerService;