##OCConfigurator
OCConfigurator build status [![Build Status](http://ec2-52-17-234-115.eu-west-1.compute.amazonaws.com:8080/buildStatus/icon?job=OC-Dev-Configurator)](http://ec2-52-17-234-115.eu-west-1.compute.amazonaws.com:8080/buildStatus/icon?job=OC-Dev-Configurator/)
> A full-featured User Interface written in Angular for UI Configuration

### OCConfigurator is available on AWS.
To use the OCConfigurator on AWS [click here](http://ec2-52-19-140-230.eu-west-1.compute.amazonaws.com/omnichannel/tool/OCConfigurator/#/home)

###Quick Start
---

Install [Node.js Version 0.12.0](https://nodejs.org/download/release/v0.12.0/).

Install grunt using below command
 
```
 $ npm install -g grunt-cli	
```

Fork this Repository to your Bitbucket Account then :
   
```
    $ git clone https://bitbucket.org/<your-bitbucket-id>/omnichannel-infrastructure.git
    $ cd omnichannel-infrastructure
    $ git checkout '<sprintx>'
    $ cd OCConfigurator
    $ npm start
```

### OCConfigurator configuration 
```
	you can find the configuration file at this location  : /omnichannel-infrastructure/OCConfigurator/src/OCConfigurator/config/config.json
	newItemURL 	: The API url for new items
    newItemFile 	: The file location for list of API 
    usingfile			: If you want to use file instead of API url change this to "yes", otherwise keep it "no"
    apiHeader		: If the API you are using require pass header parameters , write your paramameter in JSON format here 
```

