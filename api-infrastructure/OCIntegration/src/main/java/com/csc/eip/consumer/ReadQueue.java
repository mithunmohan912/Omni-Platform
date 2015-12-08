package com.csc.eip.consumer;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

import org.apache.log4j.Logger;

import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Consumer;
import com.rabbitmq.client.DefaultConsumer;
import com.rabbitmq.client.Envelope;

public class ReadQueue {

	static Logger log = Logger.getLogger(ReadQueue.class.getName());

	static final String EXCHANGE_NAME = "producerXchange";
	static final String RABBITMQ_HOST = "localhost";
	static final String RABBITMQ_USERNAME = "guest";
	static final String RABBITMQ_PASSWORD = "guest";
	static final int RABBITMQ_PORT = 5672;

	public static void main(String[] args) throws IOException, TimeoutException, InterruptedException {
		// TODO Auto-generated method stub
		ConnectionFactory factory = new ConnectionFactory();
		factory.setHost(RABBITMQ_HOST);
		factory.setUsername(RABBITMQ_USERNAME);
		factory.setPassword(RABBITMQ_PASSWORD);
		factory.setPort(RABBITMQ_PORT);
		
		Connection connection = factory.newConnection();
		Channel channel = connection.createChannel();

		channel.exchangeDeclare(EXCHANGE_NAME, "direct");
		String queueName = "Custom.Queue";
		channel.queueDeclare(queueName, true, false, false, null);
		channel.queueBind(queueName, EXCHANGE_NAME, "Queue.X");
		channel.queueBind(queueName, EXCHANGE_NAME, "Queue.Y");
		channel.queueBind(queueName, EXCHANGE_NAME, "Queue.Z");

		log.info(" [*] Waiting for messages. To exit press CTRL+C");

		Consumer consumer = new DefaultConsumer(channel) {
			@Override
			public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties,
					byte[] body) throws IOException {
				String message = new String(body, "UTF-8");
				log.info(" [x] Received '" + envelope.getRoutingKey() + "':'" + message + "'");
			}
		};

		channel.basicConsume(queueName, true, consumer);

	}

}
