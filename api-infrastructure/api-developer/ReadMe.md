 #OmniChannel API Developer
=========================

* Refer to swagger spec produced by API Designer

* Refine the swagger spec collaboratively with API Designer if needed

* Create Mock APIs

		* Import swagger spec into Sandbox and add hypermedia support
		Note: this is an optional step to producing semi-functional and testable APIs

* Develop Textured API

		* Use swagger spec to forward engineer server stub code using swagger CodeGen https://github.com/swagger-api/swagger-codegen
		* Fill in stub code with SoR logic to produce textured API

* Register Mock or Textured API

		* Login API Management
		* Create API
		* Create Plan
		* Test API (from API Management)
		* Stage Plan (to chosen Environment)
		* Publish Plan (to chosen Environment)

	IBM Knowledge Center Reference:
[API Manager](http://www-01.ibm.com/support/knowledgecenter/SSWHYP_4.0.0/com.ibm.apimgmt.apionprem.doc/APIonPrem_gettingstarted.html)
[Creating APIs](http://www-01.ibm.com/support/knowledgecenter/SSWHYP_4.0.0/com.ibm.apimgmt.apionprem.doc/task_APIonPrem_createapi.html)
[Create a Plan](http://www-01.ibm.com/support/knowledgecenter/SSWHYP_4.0.0/com.ibm.apimgmt.apionprem.doc/create_plan.html)
[Testing an API](http://www-01.ibm.com/support/knowledgecenter/SSWHYP_4.0.0/com.ibm.apimgmt.apionprem.doc/task_APIonPrem_testing.html)
[Staging a Plan](http://www-01.ibm.com/support/knowledgecenter/SSWHYP_4.0.0/com.ibm.apimgmt.apionprem.doc/deploy_a_plan.html)
[Publishing a Plan](http://www-01.ibm.com/support/knowledgecenter/SSWHYP_4.0.0/com.ibm.apimgmt.apionprem.doc/publishing_a_plan.html)

* Publish API (on a Developer Portal)

		* Login Developer Portal
		* Create Application
		* Select Plan (to use with Application)
		* Test API (from Developer Portal)
		* Test API (from REST Client such as Postman or cURL)

	IBM Knowledge Center Reference:
[Developer Portals](http://www-01.ibm.com/support/knowledgecenter/SSWHYP_4.0.0/com.ibm.apimgmt.devportal.doc/capim_devportals.html)
[Adding an Application](http://www-01.ibm.com/support/knowledgecenter/SSWHYP_4.0.0/com.ibm.apimgmt.devportal.doc/task_devportal_registerapps.html)
[Selecting a Plan](http://www-01.ibm.com/support/knowledgecenter/SSWHYP_4.0.0/com.ibm.apimgmt.devportal.doc/task_devportal_selectplan.html)
[Testing an API](http://www-01.ibm.com/support/knowledgecenter/SSWHYP_4.0.0/com.ibm.apimgmt.devportal.doc/devportal_testtool.html)
