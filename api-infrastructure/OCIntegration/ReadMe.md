 #OC Integration Engine
=========================

**To build this project use**
_mvn install_

**To install this project** 
* Copy the application WAR on to a folder on the server
* Download and copy the jetty-runner.jar file on the same folder as application WAR
* Open command prompt and set the current working directory to the above folder location (where WAR and JAR has been placed)
* Run the following command
_java -jar jetty-runner.jar OCIntegration.war_

**To run a test on the project**
* Use Postman to invoke the rest service
* For URI Transformation - 
	1. Select the "POST" method/verb
	2. Add the url _http://localhost:8080/OCIntegration/OCIntegration_
	3. Add the JSON Message in which you want to transform the URL
	4. Also specify the "pattern" and "replacement" in header for the request
	5. Submit the request by clicking on the "Send" button beside URL
* For Aggregation Pattern - 
	1. Select the "GET" method/verb
	2. Add the url _http://localhost:8080/OCIntegration/OCIntegration_
	3. Add the header "URIS" to the request and in value, add the comma separated list of the rest service URIs
	4. Submit the request by clicking on the "Send" button beside URL