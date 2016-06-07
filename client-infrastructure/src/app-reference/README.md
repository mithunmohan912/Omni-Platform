**App-Reference**
========================
**Table of contents**
-------------
* [Overview](#overview)
* [1. App.js](#1-appjs)
* [1.2 AppConf](#12-appconf)
* [1.3 Custom Factory](#13-customfactory)
* [1.4 Navigation](#14-navigation)
* [1.5 Dashboard screen](#15-dashboard-screen)
* [1.6 Quote screen](#16-quote-screen)
    - [1.6.1 Metamodel example](#161-metamodel-example)
    - [1.6.2 Dependencies](#162-dependencies)
    - [1.6.3 Focus on properties](#163-focus-on-properties) 
    - [1.6.4 Focus on actions](#164-focus-on-actions)





**OverView**
----------------
> The reference application has been created by using the Metamodel Rendering Framework based in OcInfra UI components. It's purpose is to show how to use these components and customize their behaviour in order to match any OC custom application might need. 

>This app includes the lastest ocInfra.min.js code to be able to take advantage of factories and components defined in ocInfra project. 

### 1. App.js

Since we are developing a SPA, in this file we just have one route defined in  $routeProviderService specifying one view template and our controller file. Both of them, screen.html and screen.js (screenController) are provided by ocInfra.

     $routeProvider.when('/screen/:screenId', {
            templateUrl: function() {
                return 'screen.html';
            },
            controller: ScreenController
         });

### 1.2 AppConf
Contains all the global variable values like for example the API base URL and the components templates path:

    "hostURL": "http://20.33.40.152:10114/csc/insurance/",
    "templatesURL": "ocInfra/templates/components/", 

### 1.3 CustomFactory
App-reference uses AngularJS factories to implement any screen custom  behaviour. The Factory name must match the ScreenId used in the navigation route and they are injected in every component used inside the screen. Example:

    <div>
        <renderer metamodel="screenId" factory-name="screenId +'Factory'"/>
    </div>

### 1.4 Navigation
The app-reference has two screens. The _dashboard_ screen as landing page and the _quote_ screen. 

#### 1.5 Dashboard screen
This screeen is defined as a summary, so its resourceUrl is a search and the data displayed comes mainly from the items in the search response. In its metamodel we have a table to render the quote collection data:


    {
        "metamodel": {
            "summary": true,
            "resourceUrl": "quotes?_inquiry=ci_saved_items",
            "sections": [
                {
                    "title":"Quote draft list",
                    "underline": true,
                    "properties": [
                        {
                            "id": "quotes?_inquiry=ci_saved_items",
                            "type": "table",
                            "metamodel": "quote_search_list"
                        }
                    ]
                }
            ]
        }
    }

In the quote_search_list table metamodel, we have defined a custom action to navigate to a selected quote. 

    {
        "type": "actions",
        "align": "left",
        "width": "10%",
        "options": [
            {
                "value": "edit",
                "icon": "fa fa-edit",
                "title": "_EDIT",
                "method": "dashboardToQuote"
            }
        ]
    }

This action named _dashboardToQuote_is implemented in the screen [custom factory](#customfactory), in this case, the _dashboardFactory.js_:

    dashboardToQuote: function(resource){
            $rootScope.resourceUrl= resource.href;
            $rootScope.navigate('/screen/quote');
        }

This method is in charge of navigating to the quote screen and save the url of the selected resource into the scope. _$rootScope.resourceUrl_ will be used by the renderer component to retrieve the resource from the backend.

#### 1.6 Quote screen

The renderer for this screen receives as main resourceURL a concrete quote selected in dashboard screen and requested to the API in the _dashboardToQuote_ method. It also define some dependencies in the Business object specified in its metamodel:

    "businessObject": {
            "quote": [ 
                    "quote:quote_owner_list",
                    "quote:quote_risk_list"
            ],
           
            "quote_risk": [
                    "quote_risk:quote_risk_owner_list",
                    "quote_automobile:quote_driver_list",
                    "quote_van:quote_driver_list",
                    "quote_motorcycle:quote_driver_list"
            ]
        }    

These dependencies are also needed to correctly render the quote screen and therefore, will also be requested to the API. Some of these dependencies are collection resources represented as tables and renderized by table components.

#### 1.6.1 Metamodel Example:

    {
    "metamodel": {
        "title": "Owner List",
        "name": "quote_owner_list",
        "modalRef": "quote_owner",
        "properties": [
            {
                "label": "",
                "type": "status",
                "align": "center",
                "width": "5%"
            },
            {
                "id": "_OWNER",
                "label_header": "_ROLE",
                "type": "literal",
                "align": "left",
                "width": "10%"
            },
            .
            .
            .

This table metamodel specifies the diplayed columns, the actions for buttons and the metamodel name for a popup as the value of _modalRef_ tag. In this case, _quote_owner_. The modal window is opened by the table default edit action.

quote_owner.json:

    {
    "metamodel" : {
        "name":"quote_owner",
        "labels": {
            "title": "_OWNER_POPUP",
            "ok": "_SAVE",
            "close": "_CLOSE"
        },
        "sections": [
        .
        .
        .

It defines all the metainfo needed inside the pop up:
+ name: window name
+ labels: object including:
    + title: pop up title
    + ok: ok button label
    + close: close button label
+ sections: contains properties handled by other componens like tables, inputs or other renderers. 

#### 1.6.2 Dependencies:

Inside the businessObject tag we find some dependencies representing other related resources needed to display the required data. All this dependencies wil be requested to the API once the component is loaded:


    "businessObject": {
        "quote_owner": [
                "quote_owner:person_link",
                "quote_owner:organization_link"
        ],
        "person": [
                "person:postal_address_list",
                "person:e_mail_address_list",
                "cscaia:operations"
        ],
        "organization": [
                "organization:postal_address_list",
                "organization:e_mail_address_list"
        ]
    },

#### 1.6.3 Focus on properties:

    {
        "id": ["person:last_name","organization:name", "quote_owner:name"],
        "label": "_LAST_NAME",
        "type": "autocomplete",
        "row": 2,
        "options":{
                "getData": "searchByName",
                "select": "selectPerson"
            } 
    },

**id**: We use one array as id value when the propertie value may come from different resources. In this case, this array stablishes a priority order. The component in charge of rendering this field will take its value from the first resource found. 
**options**: It specifies custom actions to trigger instead of getData and select method provided by the component typeahed input. 
>_getData_: custom action triggered after typing a value inside the input. It usually launch some kind of search.
>_select_: custom action triggered after clicking one of the values proposed by the component. 

The custom actions has to be defined in the custom factory, in this case, _quoteFactory.js_ and for example the searchByName method would be:

        searchByName: function(element){
            var url = $rootScope.hostURL + 'persons?_num=30&person:last_name='+element.$viewValue;
            return resourceFactory.get(url).then(function(response){
                var data = response.data || response;
                return data._links.item;
            
            });
        },

This method is in charge of searching the persons by a name and receives as a parameter the _element_ selected.. The list of persons is being retrieved by using the method _get_ of the _resourceFactory_ and passing the url of the resources _persons_ and the paremeter _last_name_ with the value bound to the view.

Another example of property is the _selector_:

    {
        "id": ["postal_address:postal_code", "quote_owner:postal_code"],
        "type": "autocomplete",
        "label": "_POSTALCODE",
        "selector": ["postal_address:preferred", "operation_status"],
        "attributes": {
            "maxlength": 4
        },
        "patchOnBlur": true,
        "onUpdate": "callbackQuoteOwner",
        "row": 4
    },

**selector**: The selector tag is intended to be used when a field has to be selected among several resources from a collection. Sometimes we can set an array of values as selector. In this case, all the properties defined as selector will be taken into account and the resource displayed is the one that matches the most quantity of selectors, giving them more specific weight depending on the allocation index inside the array. 

##### 1.6.4 Focus on actions:

    "actions": 
       {
            "reset": {
                "links":["quote_owner:person_link", "quote_owner:organization_link"],
                "callback": "callbackQuoteOwner"
            },
            "ok": {
                "callback": "callbackQuoteOwner"
            },
            "close": {
                "callback" : "closeOwnerPopUp"
            }              
        }
    }

* reset: The default behaviour triggers an empty patch (unpatch) for the properties specified in _links_. It also allows to set a callback function to be executed after the default action. 
* ok: It lauches a patch if any resoruce displayed in the pop up form needs to be updated. 
* close: It just close the modal window. It also check if it exists any temporary resource nos cofirmed. If that's the case, this actions deletes these resources. It also allows the posibility of having a callback funtion to be executed after the default one. 

These callback actions has to be defined in the custom factory.
