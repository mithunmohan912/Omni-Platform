Omnichannel-Infrastructure  [![Build Status](http://ec2-54-72-70-139.eu-west-1.compute.amazonaws.com:8080/buildStatus/icon?job=OCIA-Dev-Client)](http://ec2-54-72-70-139.eu-west-1.compute.amazonaws.com:8080/job/OCIA-Dev-Client/)
================================

> A full-featured User Interface written in Angular for Omnichannel Solutions 

###Quick Start
---

Install [Node.js](https://nodejs.org/download/).

Fork this Repository to your Bitbucket Account then :
   
```
    $ git clone https://bitbucket.org/<your-bitbucket-id>/omnichannel-infrastructure.git
    $ cd omnichannel-infrastructure
    $ npm start
   
```

Boom!! , This will open your default browser window running current development version. It will **reload the app** if you make changes to source files.


###Developer Guide
---

Refer to this section for more detailed instructions on different tasks

####Installing dependencies
---

This application have npm and bower dependencies.

To Install **npm dependencies** , run
 
 ```
 $ npm install	
 ``` 

To Install **bower dependencies** , run
 
 ```
 $ bower install	
 ``` 

####Run Application
---

Simply Type

 ```
 $ grunt startServer
  ``` 

####Run Unit Test Cases
---

Karma + Jasmine Unit Test cases are placed and implemented in folder `unit/tests`

To run Unit Test Cases , Simply Type

 ```
 $ grunt test
  ```   

####CodeReview
---

If you are contributing to the project , make sure you **run codereview check** against the code added. 
If you make changes when Application is up and running , a code review is performed automatically in background and display on Command windows or shell.

To run Unit Test Cases , Simply Type

 ```
 $ grunt codereview
  ``` 

####Build Package
---

If you like to build a deployable Artifact and run it in your own http server. Simply Type :

 ```
 $ grunt dist
  ``` 

This command will simply annotate all the js files present in ocInfra directory , minify annotated js and css files , recreate dist folder with new changes and also updated corresponding reference apps directories with new code. 

###Contributions
---

We understand its your day to day job to implement code and Contribute to this project repository . 

There are some ground rules set up to Contribute. Please follow instructions posted [here](https://drive.google.com/open?id=1ogAgtSQm53Op5e92nevyGM-KyoPgtzI5hoA4W6ZiisU&authuser=0)

###CodeReviews - Common Issues
---

We have observed some of the common mistakes that a developer makes while commiting his code. This issues are reported in JsHint CodeReview as well. If you are facing one of such issue
, we recommend you to look at this document [here](https://bitbucket.org/cscdev/omnichannel-client/src/43a16ce441b12bb24ae2284aa6002f448d955ad3/docs/CodeReviews.md?at=develop-Sprint5)