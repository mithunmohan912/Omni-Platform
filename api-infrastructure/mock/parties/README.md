# Mock API using sandbox

1. Go to [getsandbox](https://getsandbox.com) and create an account.

2. Select the swagger option, provide the name of your mock api in *Sandbox name* and upload the yaml file. For sample yaml refer [parties.yaml](https://bitbucket.org/cscdev/omnichannel-infrastructure/src/fe0bd6ecb1ce162d5a71e6a6aa51ba55fbbaea08/src/app-clientmanagement/docs/api-specs/?at=master)

3. All the routes and method defined in yaml will be created and available in overview tab.

4. Generated code will be present in Coding tab. By default 2 js files will be generated - 
	1. main.js -  This file will have the mapping of path,method and fuction.
					*define(path, method, function)*
	2. The name of second file will be generated from the *base path* of yaml spec. This file will have the implementation of each function defined in main.js. Per the business requirement, the logic of in each functions should be modified by user.

	[Refer the example of parties api](https://bitbucket.org/cscdev/omnichannel-infrastructure/src/6368b59e497fc9a936b7582f236455790b87c15b/api-infrastructure/mock/parties/?at=master)

5. Console tab can be used to view the incoming request and response.

6. State tab will have the state of data being added.

#### To include hypermedia support

1. Include [hypermedia.js](https://bitbucket.org/cscdev/omnichannel-infrastructure/src/6368b59e497fc9a936b7582f236455790b87c15b/api-infrastructure/mock/parties/hypermedia.js?at=master) in your sandbox code.

2. Use hypermedia by using the file as below 
		*var hypermedia = require("hypermedia.js");* 
		use the fuction *hypermedia.hypermediaSchema()*

3. Refer example [entities.js](https://bitbucket.org/cscdev/omnichannel-infrastructure/src/6368b59e497fc9a936b7582f236455790b87c15b/api-infrastructure/mock/parties/entities.js?at=master)