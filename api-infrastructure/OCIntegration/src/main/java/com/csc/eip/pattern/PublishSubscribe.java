package com.csc.eip.pattern;

import java.io.IOException;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.TimeoutException;

import org.apache.log4j.Logger;

import com.csc.eip.bo.Message;
import com.csc.eip.util.Constants;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

public class PublishSubscribe {

	static Logger log = Logger.getLogger(PublishSubscribe.class.getName());

	ConnectionFactory factory;

	public ConnectionFactory getFactory() {
		return factory;
	}

	public void setFactory(ConnectionFactory factory) {
		this.factory = factory;
	}

	public void publishMessage(Message message, String valueString, String exchangeName)
			throws IOException, TimeoutException {

		log.info("Message=" + message);
		// Establish connection to RabbitMQ server
		Connection connection = factory.newConnection();
		Channel channel = connection.createChannel();

		// Declare Exchange
		channel.exchangeDeclare(exchangeName, Constants.CHANNEL_DIRECT);

		// Read the value of routing keys with which the message needs to be
		// published to queue
		exchangeName = exchangeName.replaceAll(Constants.CURLY_BRACES_REG_EXP, Constants.EMPTY_STRING)
				.replaceAll(Constants.BLANK_SPACES_REG_EXP, Constants.EMPTY_STRING);
		log.info("exchange name=" + exchangeName);

		valueString = valueString.replaceAll(Constants.CURLY_BRACES_REG_EXP, Constants.EMPTY_STRING)
				.replaceAll(Constants.BLANK_SPACES_REG_EXP, Constants.EMPTY_STRING);
		log.info("activity=" + valueString);

		String[] valueList = valueString.split(Constants.COMMA_DELIMITER);

		Map<String, Object> any = message.getAny();
		StringBuffer strBuffer = new StringBuffer();
		for (Iterator<String> it = any.keySet().iterator(); it.hasNext();) {
			String key = it.next();
			strBuffer.append(key + ":" + (String) any.get(key) + Constants.NEXT_LINE);
		}
		log.info("String buffer----" + strBuffer.toString());
		// Publish the message from request body pay-load to the queue with the
		// routing keys retrieved from the activity parameter
		for (String val : valueList) {
			channel.basicPublish(exchangeName, val, null, strBuffer.toString().getBytes());
			log.info(" [x] Sent '" + val + "':'" + strBuffer.toString() + "'");
		}

		channel.close();
		connection.close();

		// publish the message to all the queues that have been retrieved from
		// the property

	}

}
