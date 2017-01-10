 #OC Integration Engine
=========================

**To prepare this project to run locally from the source**
_update file src/main/resources/log4j.properties property log4j.appender.logfile.File to local directory_

**To prepare this project to run locally from the source**
_update file src/main/resources/camel-config.xml element camel:sslContextParameters/camel:keyManagers/camel:keyStore/resource to local directory_

**See certificates at**
_security/_


**To run this project locally from the source**
_mvn jetty:run_

**To test this project**
* Use Postman to invoke the API proxy services for SOR APIs.

**See Postman collection at**
_postman/_


**To build this project as WAR for Bluemix IBM container**
_mvn install_

**See Docker File**
_Dockerfile_

**To login Bluemix**
_cf login_

**To view Bluemix target**
_cf target_

**To change Bluemix target organization & space**
_cf target -o <organization> -s <space>_
**where**
organization:{CSC-Insurance-API} and space:{Sandbox,Development,Pre-Release}

**To change Bluemix target space**
_cf target -s <space>_
**where**
space:{Sandbox,Development,Pre-Release}

**To view the Bluemix IBM images** 
_cf ic images_

**To build this project as a Bluemix IBM container image from WAR** 
_cf ic build -t registry.ng.bluemix.net/csc_insurance_api/ocintegration-<environmentId>:<sprintId> ._
**where**
environmentId:{sandbox,dev,release} and sprintId:{sprint##}
**for example**
_cf ic build -t registry.ng.bluemix.net/csc_insurance_api/ocintegration-sandbox:sprint32 ._

**To view the Bluemix IBM containers** 
_cf ic ps_

**To stop the ocintegration Bluemix IBM container** 
_cf ic stop ocintegration_

**To remove the ocintegration Bluemix IBM container** 
_cf ic rm ocintegration_

**To run the ocintegration image as a Bluemix IBM container** 
_cf ic run --name ocintegration -p 8888 -m 2048 registry.ng.bluemix.net/csc_insurance_api/ocintegration-<environmentId>:<sprintId>_
**where**
environmentId:{sandbox,dev,release} and sprintId:{sprint##}
**for example**
_cf ic run --name ocintegration -p 8888 -m 2048 registry.ng.bluemix.net/csc_insurance_api/ocintegration-sandbox:sprint32_

**To view the ip address list for Bluemix IBM containers** 
_cf ic ip list_

**To bind an ip address to the ocintegration Bluemix IBM container** 
_cf ic ip bind <ip-address> ocintegration_

**To view logs for the ocintegration Bluemix IBM container** 
_cf ic logs ocintegration_


**To build this project as WAR**
_mvn install_

**To run this project from a WAR** 
* Copy the application WAR on to a folder on the server.
* Download and copy the jetty-runner.jar file on the same folder as application WAR.
* Open command prompt and set the current working directory to the above folder location (where WAR and JAR has been placed).
* Run the following command - 
_java -jar jetty-runner.jar ocintegration.war_



**To build this project as WAR for Docker**
_mvn install_

**To build this project as a Docker image from WAR** 
_docker build -t <username>/ocintegration ._

**To explore the ocintegration image as a Docker container** 
_docker run -t -i <username>/ocintegration /bin/bash_

**To run the ocintegration image as a Docker container** 
_docker run --name ocintegration -d -p 8888:8888 <username>/ocintegration_


* For **URI Transformation**
For URI transformation (Clean API to Textured API and vice versa), we have built a camel route to pass the body payload and header parameters (pattern and replacement) to a bean which will then perform the pattern matching and replacement with the given string parameters.

*Test Steps*

	1. Select the "POST" method/verb.
	2. Add the url _http://localhost:8080/ocintegration/messageTranslator_.
	3. Add the JSON Message in which you want to transform the URL.
	4. Also specify the "pattern" and "replacement" in header for the request.
	5. Submit the request by clicking on the "Send" button beside URL.



* For **Aggregation Pattern**
The [Aggregator](http://camel.apache.org/aggregator.html) Integration pattern from the Apache Camel EIP patterns allows you to combine the responses from multiple rest services, as shown in the figure below -

![Aggregator Pattern](images/Aggregator.bmp)

*Test Steps*

	1. Select the "GET" method/verb.
	2. Add the url _http://localhost:8080/ocintegration/aggregator_.
	3. Add the header "URIS" to the request and in value, add the comma separated list of the rest service URIs.
	4. Submit the request by clicking on the "Send" button beside URL.


* For **Publish/Subscribe Channel Pattern**
Camel supports the [Publish Subscribe Channel](http://camel.apache.org/publish-subscribe-channel.html) from the EIP patterns, that allows you to publish a message to a queue from where it can be read by multiple consumers who have subscribed for the activity/event. The AMQP product [RabbitMQ](http://www.rabbitmq.com/) has been used for queue management. The figure below represents the implementation -
 
![Publish/Subscribe Channel Pattern](images/PubSub-channel.bmp)

*Test Steps*

	1. Select the "POST" method/verb.
	2. Add the url _http://localhost:8080/ocintegration/publish_.
	3. Add the header "activity" to the request and in value, add the activity (Activity1, Activity2 or Activity3).
	4. Add some message in the body payload that you would want to be posted to the queue.
	5. Submit the request by clicking on the "Send" button beside URL.


* For **Pipes and Filters Pattern**
Camel supports the [Pipes and Filters](http://camel.apache.org/pipes-and-filters.html) pattern, which allows us to split the processing across multiple independent end-point instances which can then be chained together. We can create pipelines of logic using multiple end-point instances as follows -

![Pipes and Filters Pattern](images/PipesAndFilters.bmp)

*Test Steps*

	1. Select the "POST" method/verb.
	2. Add the url _http://localhost:8080/ocintegration/pipeline_.
	3. Add the "pattern" and "replacement" in header for the request.
	4. Add the header "activity" to the request and in value, add the activity (Activity1, Activity2 or Activity3).
	5. Add some message in the body payload that you would want to process.
	6. Submit the request by clicking on the "Send" button beside URL.