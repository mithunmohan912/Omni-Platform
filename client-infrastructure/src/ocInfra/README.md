**OCInfra**
========================

**Table of contents**
-------------
* [Overview](#overview)
* [Components](#components)
* [1. Renderer](#1-renderer)
    - [1.1 Renderer metamodel](#11-renderer-metamodel)
    - [1.2 Renderer template](#12-renderer-template)
    - [1.3 Renderer usage](#13-renderer-usage)
* [2. Input](#2-input)
    - [2.1 Input directive usage](#21-input-directive-usage)
    - [2.2 Input metamodel example](#22-input-metamodel-example)
    - [2.3 Input metamodel structure](#23-input-metamodel-structure)
    - [2.4 Input metamodel attributes and options](#24-input-metamodel-attributes-and-options)
        + [2.4.1 Autocomplete](#241-autocomplete)
        + [2.4.2 Decimal](#242-decimal)
        + [2.4.3 Money](#243-money)
        + [2.4.4 Email](#244-email)
        + [2.4.5 Number](#245-number)
        + [2.4.6 Percentage](#246-percentage)
        + [2.4.7 Select](#247-select)
        + [2.4.8 TextMask](#248-textmask)
        + [2.4.9 Text](#249-text)
        + [2.4.10 Textarea](#2410-textarea)
        + [2.4.11 Toggle](#2411-toggle)
        + [2.4.12 Date](#2412-date)
        + [2.4.13 Checkbox](#2413-checkbox)
        + [2.4.14 Label](#2414-label)
        + [2.4.15 Radio](#2415-radio)
        + [2.4.16 Range](#2416-range)
        + [2.4.17 Captcha](#2417-captcha)
* [3. Table](#3-table)
    - [3.1 Table usage](#31-table-usage)
    - [3.2 Table metamodel](#32-table-metamodel)
    - [3.3 Table metamodel properties](#33-table-metamodel-properties)
        + [3.3.1 Table label](#331-table-label)
        + [3.3.2 Table literal](#332-table-literal)
        + [3.3.3 Table icon](#333-table-icon)
        + [3.3.4 Table status](#334-table-status)
        + [3.3.5 Table actions](#335-table-actions)
* [4. Pop up](#4-pop-up)
    - [4.1 Pop up metamodel example](#41-pop-up-metamodel-example)
    - [4.2 Pop up directive usage](#42-pop-up-directive-usage)
    - [4.3 Pop up code example](#43-pop-up-code-example)
* [Metamodels](#metamodels)
    - [Business object](#business-object)
* [Factories](#factories)
* [5. Resource factory](#5-resource-factory)
    - [5.1 Methods](#51-methods)
* [6. Metamodel factory](#6-metamodel-factory)
    - [6.1 Methods](#61-methods)
* [Events](#events)

**OverView**
----------------

>Components usage examples: App-reference


###Components
Onmichannel UI renderer is based on AngularJS directives, which will evolve to match the Omnichannel projects development needs. As of today, the rendering process is made thanks to the following directives (_helper directives not included below_):
	
+ Renderer
+ Table renderer
+ Pop Up renderer
+ Input renderer

The source code for those directives is separated in two folders: `src/ocInfra/js/components` will hold directive controllers and `src/ocInfra/templates/components` will hold directive HTML templates:


    +-- ocInfra
    |   +-- js
    	|   +-- components
            |   +-- renderer.js
            |   +-- popup.js
            |   +-- table.js
            |   +-- input.js
            |   ...helper directives...
    |   +-- templates
    	|   +-- components
    		|   +-- renderer.html
    		|   +-- popup.html
    		|   +-- table.html
    		|   +-- input.html
            |   ...specific input templates...


### 1. Renderer

Top level angular directive that interprets the highest level metadata and uses the different kind of renderers to display the components. It aims to be the main dispatcher of UI rendering processes.

#### 1.1 Renderer metamodel

The renderer metamdel is made out of sections. Those sections are objects with different properties such as the title, the colspan, or the properties among others:

* __title__: Text to display as the title of the section. A key contained in a i18n file can be used also.
* __underline__: Boolean representing whether or not the title should be underlined.
* __row__: Number (1-based) of the row where the section will have to be placed. This allows the sections to not be correlatives, since you can define a section anywhere and then it will be inserted in the right row.
* __colspan__: Number that represents the number of columns that the section will use. It uses bootstrap underneath, so the maximum colspan is 12. The minimum colspan is not 1, as it could be expected, but 3 because we do not want to allow more than 4 sections per row (more sections wouldn’t be user friendly since the content would be so small).
* __properties__: Array containing json objects that define the content displayed within the section. The object attributes vary from one to another depending on the directive that is going to interpret them (table, input, etc.)
* __resourceUrl__: This is intended to be used in the first screen. It represents the first API call when launching the application. 
* __accordion__: Flag that allows you to toggle content on the current section
* __collapse__: Flag property of accordion that define if section is collapse by default or not
The renderer could include other renderer component. This is handled using a section type reference in the metamodel:
* __$ref and type__: This twon properties allows to link antoher metamodel file that will be handled by another render instance. 

Example:

	{
	    "metamodel": {
	        "sections": [
	            {
	                "$ref": "quote_data",
	                "type": "reference",
                    "accordion":true,
                    "collapse":true,
	            },
	            {
	                "title":"Interested parties",
	                "underline": true,
	                "properties": [
	                    {
	                        "id": "quote:quote_owner_list",
	                        "type": "table",
	                        "metamodel": "quote_owner_list"
	                    },
        

#### 1.2 Renderer template

Based on the metamodel property type, the component will render different kind of sections:

• **Table**: Including another custom directive in this section. [Table](#2-table). In metamodel:
					
	{
        "id": "quote:quote_owner_list",
         "type": "table",
          "metamodel": "quote_owner_list"
     } 
		 																

- id: Resource name to look for inside the API responses. 
- metamodel: Table metamodel file relative path. 

• **Buttons**: HTML Input type buttons. In metamodel:
	
	{
        "type": "buttonGroup",
        "buttons": [
        {
        	"icon": "fa-save",
            "tooltip": "Save quote",
            "action": "saveQuote"
        }
      ]		
	}
   
- icon: CSS class for icon
- tooltip: Tooltip text. Could be a key existing in a locale file. 
- action: Action to execute onclick. This method has to be included in a custom factory and receives as a parameter the resource bound in the scope.

   	 
• **Pop up**: Bootstrap modal window. [Pop Up](#3-pop-up) . In metamodels:

	{
        "type": "popup",
         "popup": {
              "name": "editQuoteData",
               "label": "_EDIT_QUOTE_DATA",
               "metamodel": "quote_data",
                 }
      }

- name: name used to link the button with the modal window. 
- label: Button label
- metamodel: Pop up metamodel file relative path.

• **Custom**: Section used to include a custom html view. 

    {
        "id": "quote:quote_risk_list",
        "metamodel": "quote_coverage_risk",
        "type": "custom",
        "templateUrl": "templates/coverage_template.html"
    } 

- id: Resource name to look for inside the API responses. 
- metamodel: Metamodel file relative path. 
- templateUrl: HTML view relative Path.

Any other property type will be renderized using an [input component](#4-input) 

#### 1.3 Renderer usage

Directive attributes:
    * metamodel: Metamodel file relative path.
    * factoryName: Custom Factory defined for custom screen actions.
	* resourceUrl: API resource (optional).

Example:

	<div>
		<renderer metamodel="screenId" factory-name="screenId+'Factory'"/>
	</div>


### 2. Input
- - - -
The input directive is the component in charge of rendering properties (coming from backend or even if they are UI-only fields), setting the appropriate constraints when necessary (such as when the property is required or if it is editable or not among others). For that, this component uses 1 controller for all types of inputs, some directives for things such as formatting or decimal numbers, 1 input html template out of the set of templates available, and a metamodel defined in JSON format. Its distribution in the repository is as follows:
    
* __Directives and input controller__: Under `src/ocInfra/js/components` you may find _input.js_, _capitalize.js_, _decimal-input.js_ and _format-date.js_.

* __HTML templates__: Located under `src/ocInfra/templates/components` you may find several html templates prefixes with the word _input_ as well as _backend-error-display.html_ and _help-tooltip-display.html_, which are used to display errors and help tooltips respectively.

#### 2.1 Input directive usage
The input directive (_input-render_ HTML element) needs several entry parameters to be able to work and render the content properly. Those parameters are for example the metamodel of the input to render, the value from the backend, etc. Below the complete list of entry parameters as well as the reason for them to exist:

* __id__: Due to the dynamic nature of the API, the identifier for the generated HTML element will not be known statically in some cases so the scope where the input directive is being used needs to pass this id to the directive.
* __property__: This is the backend property that the input will display. If the input is going to be used to render an UI-only field, this property may be undefined.
* __metamodel__: JSON object holding the necessary information for the rendering of the input, such as the type or configuration for the input.
* __update-mode__: String used to indicate the directive the type of event to invoke the on-update callback (and potentially the default patch functionality). Possible values are _blur_ (by default) and _change_.
* __on-update__: String used to indicate the name of the method to be invoked when the input detects a change. This parameter allows the developers to add any custom behaviour after an input change.
* __base-url__: String that specifies a path to the folder where the input templates are stored. By default it points to the templates folder specified [here](#components), but if the developers need to create custom inputs not present in the ocInfra framework they can do it this way.
* __resources__: Object that stores all the properties of the current scope that can be shown. This object is passed to the input directive because it may be necessary to create new properties under that object (i.e UI-only fields).
* __factory-name__: String that specifies the name of the AngularJS factory holding the methods created by the developers.

###### Code example
```
<input-render id="id" property="resourcesToBind.properties[id]" metamodel="column" update-mode="{{column.updateMode}}" on-update="{{column.onUpdate}}" base-url="{{column.baseUrl}}" resources="resourcesToBind.properties" factory-name="screenId+'Factory'"></input-render>
```

#### 2.2 Input metamodel example
    {
        "id": "quote_automobile:ext_model",
        "label": "_MODEL",
        "type": "autocomplete",
        "attributes": {
            "maxlength": 40,
            "capitalize": true
        },
        "row": 2
    }
The main keys present in the metamodel object are `id` and `type`.

* __Id__: It is the identifier of the property in the backend. It is required for backend properties and the fact of not founding it into the API resource will avoid the rendering of the input.
    - The previous behaviour does not apply to the case of an UI-only field. In that case the id will represent the name of the property where the input will store its value.
* __Type__: The type specified within the metamodel object is used to know which template we will need to render and, accordingly, the default configuration that has to be used in that input.

_Since the rest of keys vary from one type to another, they will be explained in detail for every type of input._

#### 2.3 Input metamodel structure

* __Id__: Explained [here](#41-input-metamodel-example).
* __Type__: Explained [here](#41-input-metamodel-example).
* __Name__: _Optional_. String to be used in the name HTML attribute of the input element. If not present, the _id_ will be used as name.
* __Label__: _Optional_. String or i18n key to be used as the input label. If present it will use 4 bootstrap columns and if not present the input will span the whole space (12 columns).
* __Placeholder__: _Optional_. String or i18n key to be used in the input's placeholder.
* __PatchOnBlur__: _Optional_. Boolean flag that indicates whether or not we should patch a property when its value changes or when the input loses the focus. To know when the patch has to be triggered it uses the directive attribute [_update-mode_](#41-input-directive-usage).
* __Visible__: _Optional_. Boolean flag used to overwrite the input's visibility. By default the input is always visible.
* __VisibleWhen__: _Optional_. Object that contains one or several expressions that will be evaluated in order to determine the visibility of the field. (DEPRECATED)
* __Label-size__: _Optional_. String that takes the value _lg_ to enable bigger labels. In this case, they would span 8 columns instead of just 4.
* __Icon__: _Optional_. As of today, used for the _input-label.html_ template to display an icon beside the value of the 'input'.
* __Format__: _Optional_. String specifying the format for the dates when using an _input-label_. By default it gets the value _dd/MM/yyyy_.
* __Tooltip__: _Optional_. String or i18n key to be used as the input's tooltip to help users.
* __Attributes__: _Optional_. Object containing configuration attributes. They are different for the different types of inputs so they will be detailed within the sections below.
* __Options__: _Optional_. Object containing method names to be used. Some types of inputs used them and some of them don't, so they will be detailed alongside the attributes for every type of input.

###### Example

    {
        "id": "quote_driver:name",
        "label": "_LAST_NAME",
        "type": "autocomplete",
        "row": 1,
        "options": {
            "getData": "searchDriver",
            "select": "selectDriver"
        }
    },
    {
        "id": "quote_driver:first_name",
        "type": "autocomplete",
        "label": "_FIRSTNAME",
        "attributes": {
            "maxlength": 40,
            "typeahead-wait-ms": 3000
        },
        "row": 2
    }

#### 2.4 Input metamodel attributes and options
This sections specifies the available properties within the _attributes_and _options_ objects of the metamodels.

##### 2.4.1 Autocomplete

###### Attributes
* __typeahead-wait-ms__: Number. Minimum amount of milliseconds to wait before firing the search method to get the data that will have to be shown in the dropdown.
* __typeahead-focus-first__: Boolean. Whether or not the focus should be set on the first value of the dropdown.
* __typeahead-min-length__: Number. Minimum amout of characters that must be in the input in order to fire the search method.
* __maxlength__: Number. Maximum number of characters that the input can hold.
* __capitalize__: Boolean. Whether or not the values should be upper case. If it is false, then the dropdown values will be the same returned by the search method without any modification.

###### Options
* __getData__: String. Name of the method that will be in charge of getting the data for the autocomplete’s dropdown. The directive infers a default behavior defining the following options:
    - href: url to get the data for the autocomplete’s dropdown
    - params: name of the parameter to include in the request
* __select__: String. Name of the method to use when a value of the dropdown has been selected. Again the directive cannot provide a default functionality in this case.
* __typeaheadBlur__: String. Name of the method to invoke when the typeahead loses the focus. By default, the method configures the dropdown to not be shown again, preventing this way the possibility that an asynchronous getData makes it displays when the user is no longer on that input. Please notice two things:
    - The onUpdate (potentially the default patch on blur) method gets invoked first and then the typeaheadBlur gets invoked.
    - Any method overriding this one may want to take care of hiding the dropdown as the default behavior does.
* __typeaheadFocus__: String. Name of the method to be invoked when the input gets the focus. The default functionality is to enable the dropdown to be shown (counteract the default typeaheadBlur).

###### Default values
| typeahead-wait-ms | typeahead-focus-first | typeahead-min-length | maxlength | capitalize |
|-------------------|-----------------------|----------------------|-----------|------------|
|       1000        |         false         |           3          |  9999999  |    false   |

##### 2.4.2 Decimal

###### Attributes
* __decimalPrecision__: Number. Number of decimals after the decimal separator (dot).
* __minimum__: Number. Minimum possible value for the input. Any introduced value below this minimum will be set to the minimum.
* __maximum__: Number. Maximum possible value for the input. Any introduced value higher than this maximum will be set to the maximum value.

###### Options
>_None._

###### Default values
| decimalPrecision | minimum | maximum |
|------------------|---------|---------|
|         2        |    0    | 9999999 |

##### 2.4.3 Money

###### Attributes
* __currency__: String. Short name of the currency icon that is going to be shown alongside the input. Possible currencies are: _eur_, _usd_, _gbp_, _yen_, _rub_ and _won_.
* Since this input holds decimal values, the attributes for the [decimal input](#442-decimal) apply here.

###### Options
>_None._

###### Default values
| currency |
|----------|
|    eur   |

##### 2.4.4 Email

###### Attributes
* __maxLength__: Number. Maximum amount of characters that the input can hold.

###### Options
>_None._

###### Default values
| maxLength |
|-----------|
|  9999999  |

##### 2.4.5 Number

###### Attributes
* __min__: Number. Minimum number allowed.
* __max__: Number. Maximum number allowed.


###### Options
>_None._

###### Default values
| min |   max   |
|-----|---------|
|  0  | 9999999 |

##### 2.4.6 Percentage

###### Attributes
This type uses the same attributes as the [decimal input](#442-decimal).

###### Options
>_None._

##### 2.4.7 Select

###### Attributes
* __capitalize__: Boolean. Whether or not the values of the select and the selected value should be all upper case.

###### Options
* __getData__: String. Name of the method that will be invoked to get the data that will be shown in the select dropdown. By default, the input fills the select with the values of the enum attribute present in the property it is bounded to.

###### Default values
| capitalize |
|------------|
|   false    |

##### 2.4.8 TextMask

###### Attributes
* __capitalize__: Boolean. Whether or not the text should be transformed to upper case.
* __mask__: String. Pattern to mask the text with.

###### Options
>_None._

###### Default values
| capitalize |      mask      |
|------------|----------------|
|   false    | _Empty string_ |

##### 2.4.9 Text

###### Attributes
* __capitalize__: Boolean. Whether or not the text should be transformed to upper case.
* __maxLength__: Number. Maximum number of characters that the input can hold.

###### Options
>_None._

###### Default values
| capitalize | maxlength |
|------------|-----------|
|   false    |  9999999  |

##### 2.4.10 Textarea

###### Attributes
* __maxLength__: Number. Maximum number of characters that the input can hold.

###### Options
>_None._

###### Default values
| maxlength |
|-----------|
|  9999999  |

##### 2.4.11 Toggle

###### Attributes
* __true_label__: String. Text to be displayed alongside the ‘true’ value of the input. This text will be translated using the i18n resource files.
* __false_label__: String. Counterpart of the true_label but for the ‘false’ value of the input. The text will be translated using i18n resource files.

###### Options
>_None._

###### Default values
| true_label | false_label |
|------------|-------------|
|   _TRUE    |   _FALSE    |

##### 2.4.12 Date

###### Attributes
* __dateFormat__: String. Format for the date (i.e: dd/MM/yyyy).
* __startWeek__: Number. Number representing the starting day of the week. 0 is Sunday, 1 is Monday, etc.
* __trigger__: String. Name of the event that shows the datepicker. Possible values are: click, hover, focus and manual.
* __autoclose__: Boolean. Whether or not the datepicker should be hidden after selecting a date.

###### Options
>_None._

###### Default values
| dateFormat | startWeek | trigger | autoclose |
|------------|-----------|---------|-----------|
| dd/MM/yyyy |     1     |  focus  |    true   |

##### 2.4.13 Checkbox

###### Attributes
* __postion__: String. Defines the position of the checkbox and his label. If position is defined as "after". Checkbox position is shown before than label. By default is shown first label and second checkbox component. 

###### Options
>_None._

##### 2.4.14 Label
This type is not strictly an input since it only displays data. However, it is rendered by the input directive for simplicity. Due to the fact that it is going to render any type of data as a read-only field, it allows different parameters for customizing the label.

###### Attributes
* __icon__: _Font awesome_ class used to show an image at the end of the label. I.e: EUR symbol.
* __class__: Class name used to add styling to the label.
* __format__: For dates only. Used to specify the date format. The backend metadata is used in order to determine whether or not the data is a date.

###### Options
>_None._


##### 2.4.15 Radio

> _TODO_

##### 2.4.16 Range

This type displays two input components of any type. It has to be defined as a _uiInput_ and specify the properties of the range in the attributes section.

###### Attributes
* __range__: Array of properties of the range.

###### Example

                {
                    "id": "duration",
                    "label": "_DURATION",
                    "type": "range",
                    "uiInput": true,
                    "attributes": {
                        "range": [
                            {
                                "id": "quote:start_date",
                                "type": "date",
                            },
                            {
                                "id": "quote:end_date",
                                "label": "_TO",
                                "type": "date"
                            }
                        ]
                    },
                },

##### 2.4.17 Catpcha

This types defined a way of challenge-response test used in computing to determine whether or not the user is human.

* for use this component, we have to follow these steps before of define or use this component: 
First, you need to get a valid recaptcha key for your domain. Go to http://www.google.com/recaptcha. otherwise our component is not going to work fine. 
for example: in this case, localhost domain is covered by this key 6Ldf8ggUAAAAAKn1FVMTxBjoWmQ_S6K5oTgTeUtH but you have to provide it. 
* Include the reCaptcha API using this script in your HTML:
    Example: 
    
    <script
    src="https://www.google.com/recaptcha/api.js?onload=vcRecaptchaApiLoaded&render=explicit"
    async defer
    ></script>



###### Metamodel properties
* __id__: Id of the captcha component.it's  mandatory
* __type__: 'captcha'.it's  mandatory
* __label__: text label for captcha component. it's  mandatory.
* __uiInput__: set to true value,it's  mandatory.
* __key__: "---YOUR PUBLIC KEY GOES HERE----" // Key to be provided by google captcha. it's  mandatory and has to ve valid otherwise this component is not going to work properly
* __onSuccess":"getResponseFromCaptchaFunction" // Custom function in custom app factory 
* __attributes__: optional to be defined
        ** ___ theme="---- light or dark ----" //light by default
        ** ___ size="---- compact or normal ----" //compact by default
        ** ___ type="'---- audio or image ----'" // Image by default
* You have to define in your customFactory the method for your success response. Your input parameter if a valid key provided by google recaptcha for example: 

In this quote factory we have defined getResponseFromCaptchaFunction for retrieving the valid key. 

/*

app.factory('quoteFactory', function($rootScope, $location, resourceFactory, $resource, $http, pdfFactory){

    function _getOperationsResource(properties){
        var urls = {};
        for(var key in properties){
            if (properties[key].self.indexOf('operations') > -1){
                urls[properties[key].self] = properties[key].self;
            }
        }
        return urls;
    }

    return {

        getResponseFromCaptchaFunction: function(params, resp){
            console.log('Success Response in captcha functionality [Code:'+ params);
        }, 

*/

### 3. Table
- - - -
This angular directive is in charge of rendering tables. The component is able to retrieve its data from a url and may use the [popup](#4-pop-up) component to modify the collection.

#### 3.1 Table usage

The table renderer directive has an isolate scope and it is restricted to elements. The directive attributes are:

* resourceUrl: API resource url containing the collection.
* metamodel: Metamodel file relative path.
* factoryName: Custom Factory defined for custom screen actions.

Example:

    <table-render resource-url="resourcesToBind[column.id].href" metamodel="column.metamodel" factory-name="factoryName"></table-render>
    


#### 3.2 Table metamodel

The metamodel definition by default is as follows, a metamodel element that could include the folowing attributes:

* __name__: name to link the actions in the table and the popup component.
* __searching__: flag to show the searching input at the top of the table.
* __pagination__: flag to show the pagination footer.
* __header__: flag to indicate whether the table has to shown a header or not.
* __buttons__: object to indicate if there will be buttons at the bottom of the table.
    - __label__: label for the button that could be included at the bottom of the table to add a new item to the collection.
    - __method__: optional, name of the function in the custom factory that is going to overwrite the default action.
    - __callback__: optional, name of the function in the custom factory that is going to be executed after the default action.
    - __values__: optional, list of the possible buttons, a value for each button that also indicates the order to be displayed. Example:

            {   
                "buttons": {
                    "values": ["Syndic", "contact", "representative"]
                }
            }

* __modalRef__: metadata file relative path that includes the metadata definition for the popup.
* __filters__: optional, valid values to filter the collection, a pair key/value that indicates the property and an array of possible values. For example:

        {
            "filters": { "party_role:role_type": ["owner"] }
        }

* __properties__: list of fields that the table is going to include, one for each table column.

Example:

        {
            "metamodel": {
                "name":"quoteList",
                "searching": true,
                "pagination": "true",
                "properties": [
                    {
                        "id": "quote:product_id",
                        "label_header": "_PRODUCT_TYPE",
                        "type": "icon",
                        "width": "5%"
                    },
                    {
                        "id": "quote:identifier",
                        "label_header": "_NUMBER",
                        "type": "label",
                        "align": "left",
                        "width": "10%"
                    },
                    ...


#### 3.3 Table metamodel properties
Depending on the property type, its metadata definition can be slightly different. These are the common attributes:

* __id__: Name of the backend property that will be displayed. In some cases, this property can be an array of names.
* __label_header__: Text or key in the i18n file representing the column header to use when there is not a header section specified for the table.
* __align__: the align property value for the table column.
* __width__: the width property value for the table column.
* __type__: Text used to indicate the type of cell that will have to be displayed. Some possible values are explained in the folowing sections.

##### 3.3.1 Table label

Label type used to display the value of the property specified in the *id* attribute that could be an array of ids. It would be also posible to specify an attribute *format*, for example 'dd/MM/YYYY' for a date.

Example:

            {
                "id": "quote:identifier",
                "label_header": "_NUMBER",
                "type": "label",
                "align": "left",
                "width": "10%"
            }

##### 3.3.2 Table literal

Literal type used to render the *id* value directly in the table cell, it may be a text or key in the i18n file.

Example:

            {
                "id": "_DRIVER",
                "label_header": "_ROLE",
                "type": "literal",
                "align": "left",
                "width": "10%"
            }


##### 3.3.3 Table icon

Icon type used to display one image in the cell. The image (flaticon font type class) will be obtained either from the *icon* property available in the metadata or from the value of the property, using this value to select an icon from the metadata property *iconList*.

Example:

            {
                "id": "quote:product_id",
                "label_header": "_PRODUCT_TYPE",
                "type": "icon",
                "width": "5%"
            }
    ],
    "iconList": 
            {
                "MC011": "flaticon-car95", 
                "MD005": "flaticon-delivery50", 
                "MA002": "flaticon-motorbike", 
                "MC002": "flaticon-single17", 
                "IN005": "flaticon-home168", 
                "AX009": "flaticon-adults"
            }


##### 3.3.4 Table status

Status type used to insert an icon displaying the entity backend status of the resource.

Example:

            {
                "label": "",
                "type": "status",
                "align": "center",
                "width": "5%"
            }

##### 3.3.5 Table Actions

Action type defines a list of actions to be included for each item in the table. It is required by every action to add an element in the *options* attribute containing the following fields:

* __value__: the name of the action. The component provides two default actions that can be used:
    - edit: open the modal window with the item selected
    - delete: remove the item selected from the collection
* __title__: optional, text that could be displayed as a link. 
* __icon__: optional, image of the action.
* __method__: optional, name of the function in the custom factory that is going to overwrite the default action, it receives as a parameter the resource selected.
* __callback__: optional, name of the function in the custom factory that is going to be executed after the default action.

Example:

        {
                "type": "actions",
                "align": "left",
                "width": "10%",
                "options": [
                    {
                        "value": "copy",
                        "title": "_COPY",
                        "icon": "fa fa-copy"
                    },
                    {
                        "value": "edit",
                        "icon": "fa fa-edit",
                        "title": "_EDIT",
                        "method": "dashboardToQuote"
                    }
                ]
            }

_Since the table uses the [input](#2-input) renderer underneath, it could be possible to render in a cell any type allowed by the component, as well as any behavior allowed by it such as the patch of the property._

### 4. Pop Up
- - - -

This component handles the screen section expected to be renderized inside a modal window. It usually appears with a button group to trigger some actions related to its form data and a "X" button to close the modal. 

The metamodel definition interpreted by a pop up can include the follow attributes:

•	**actions**: defines the functions to be executed by the popup buttons. This actions will override the popup default actions.
•	**labels**: object which properties define the text (or key in i18n file) used for the title and buttons of the popup.
•	**sections**: similar to the renderer directive.
•	**actions**: Actions that can be triggered from the pop up:
	- reset:
		+ links: resource links to be unpatched 
        + method: custom action to overwrite the the default behaviour 
		+ callback: custom action to be executed after the default behaviour. 
	- ok: Action to be executed from ok accept button.
         + method: custom action to overwrite the the default behaviour - 
		+  callback: custom action to be executed after the default behaviour.
	- close: Action to be executed from X button.
        + method: custom action to overwrite the the default behaviour - 
		+ callback: custom action to be executed after the default behaviour.
		
####4.1 Pop up metamodel example:

	"name":"quote_owner",
        "labels": {
            "title": "_OWNER_POPUP",
            "ok": "_SAVE",
            "close": "_CLOSE"
        },
        "sections": [
            {
            "properties": [
                {
                    "id": "quote_owner:legal_classification",
                    "label": "_LEGAL_ACTIVITY_CLASS",
                    "type": "select",
                    "row": 2
                 }
             ]
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
        }]  

####4.2 Pop up directive usage:

The popup renderer directive has an isolate scope and it is restricted to elements. Its scope option contains the following properties:

-**ui-id**: modal window id selector. 
-**metamodel**: Metamodel file relative path.
-**factoryName**: Custom Factory defined for custom screen actions. 
-**resourceUrl**: API resource (optional).

####4.3 Pop up code example:

	<popup-render ui-id="modal_{{metamodelObject.name}}" metamodel="metamodelObject.modalRef" resource-url="itemSelected.href" factory-name="factoryName"></popup-render>


##Metamodels
Omnichannel projects metamodel are a set of json files specifying the layout and some features contained in the application screens, sections, or modals among others. 

The main key of this JSON objects is the _metamodel_ key. Every file would be therefore similar to this:

    {
        "metamodel":{
            "sections":[
                {
                    ... section 1 ...
                },
                {
                    ... section 2 ...
                },
                ... more sections ...
            ],
            ... more stuff ...
        }
    }

Apart from the _sections_ element and all that comes with it, which are the basic elements to create the application screens, there are other objects/properties available within the _metamodel_ object.

### Business object
The business object is a powerful capability that allows the developer to extract more dependencies from the API without having to worry about how to process them. The framework automatically inspects this object to extract more resources starting from a root resource.
To clarify how it works, these are the steps the framework does with this object:

1. Extract a resource from the backend.
2. Analyze the resource to get its keys. What the framework does to get those keys is split the resource properties and use the first part of the split as a key. I.e: The key of the property _quote:identifier_ would be _quote_.
3. Go to the business object and do a match between the extracted keys and the keys present in the object. Then it will store the link names found under every matched key to use them later on.
4. At this point the framework knows two things: a resource and a set of link names. It does not have the url for those link names yet, so it will try to find them in the resource it knows. As an output of this process, the framework will know the urls it will have to query.
5. This process is repeated for every resource retrieved.

###### Example
    {
        "metamodel":{
            "sections":[
                {
                    ... section 1 ...
                },
                {
                    ... section 2 ...
                },
                ... more sections ...
            ],
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
        }
    }

The above example basically means: For a __quote__ resource I want to retrieve the resources referenced by the names __quote:quote\_owner\_list__ and __quote:quote\_risk\_list__. As a consequence of retrieving those related resources, the framework will find resources of type __quote\_risk__, and then it will retrieve also the resources specified for that type in the business object.

##Factories
OcInfra provides developers with 2 factories: one named _resourceFactory_ for API interactions and another one named _MetaModel_ to provide the metamodel loading functionality.

### 5. Resource factory
The resource factory (named _resourceFactory_) is the factory in charge of interacting with any RESTFUL API. Internally it holds a kind of cache (in the sense that it caches the data but it has no timeout to know when the data is old enough to retrieve it again) that avoids request duplication as well as network traffic.

#### 5.1 Methods
* __get (_url_, _params_, _headers_)__: Gets a resource from the API by querying the specified URL and emits a [_resourceDirectory_ event](#events) named _resourceDirectory_ when the response is retrieved. In the case that the url has already been queried, it will return the cached value and it will not throw any event. In both cases, this method returns a promise with the raw HTTP response as parameter.
    -  _Returns_: A promise.
* __refresh (_url_, _params_, _headers_)__: Same behaviour as the _get_ method but in this case it doesn't use the cache, it will always query the API.
    - _Returns_: A promise.
* __post (_url_, _params_, _headers_)__: Method used to make a _POST_ request to the API. When the API responds, a [_resourceDirectory_ event](#events) will be thrown with the URL used for the request as well as the API response.
    - _Returns_: A promise.
* __delete (_url_, _headers_)__: Method used to make a _DELETE_ request against the specified URL. When the API responds, the method throws a [_resourceDirectory_ event](#events) with the URL used for the request, the API response and the previous value (the resource that existed before the delete operation got executed).
    - _Returns_: A promise.
* __patch (_url_, _params_, _headers_)__: Used to make a _PATCH_ request agains the URL passed in the argument list. When the API responds, it throws a [_resourceDirectory_ event](#events) with the URL, the new resource and the previous one.
    - _Returns_: A promise.
* __execute (_url_, _params_, _headers_, _method_)__: This method is able to use any HTTP method to launch a request agains the specified URL, and will throw a [_resourceDirectory_ event](#events) whenever it gets the response.
    - _Returns_: A promise.

> For all the above cases, _params_ is the parameter that contains the payload of the request. Let's say you are performing a _PATCH_ request, the _params_ in this case would be the object containing the key-value pairs with the resource data.

### 6. Metamodel factory
The metamodel factory (named _MetaModel_) is the factory in charge of loading the metamodels as well as to process any data that has something to do with the metamodel objects, like interpreting them to build objects that the components can understand or analyze/transform an URL to query the right System Of Record (SOR).

#### 6.1 Methods
* __load (_scope_, _regionId_, _screenId_, _onSuccess_, _resolve_)__: Method used to load a metamodel JSON file. It will load the metamodel as well as any other metamodel referenced by the first one, inserting the objects into the scope. The _regionId_ parameter is used to dynamically change from one SOR to another, and the _screenId_ is the file name of the metamodel to load (usually the metamodel name matches the screen id). It does not return a promise, so we should use the _onSuccess_ callback to know when the loading process has finished. It also allows to be passed a _resolve_ function, so if a promise in a higher scope has to wait until the load is complete we can pass the resolve function to the _load_ method and that promise will be resolved when the metamodel loading process has concluded.
* __prepareToRender (_rootURL_, _metamodel_, _resultSet_, _dependencyName_, _refresh_)__: This method is used widely by the different renderer components. Based on an URL it will load it and then any linked resource specified within the metamodel object, appending all the results to the _resultSet_ object. The two parameters at the end, _dependencyName_ and _refresh_ are used internaly when making the recursive calls to retrieve linked resources. Below it is the structure of a result explained in detail:
    - When calling this method, you must provide it with an object as third parameter (_resultSet_) since that is the object that will store all the resources. The pairs key-value of that object will be the URL as the key and the processed resource returned by the API as the value. That processed resource (object that the renderer components understand) is composed by:
        + __dependencies__: Array of objects. Each one of those objects have an _href_ attribute with the URL of a resource and _resource_ containing the name that its parent resource used to refer to it.
        + __identifier__: Resource identifier. It is the resource name seen in the _dependencies_ attribute or the last part of the resource URL if it has no name in its parent resource.
        + __href__: Resource's URL.
        + __up__: Parent resource's URL.
        + __items__: Similar to _dependencies_ but in this case it is used to hold the items of a collection resource. Every object of this array contains a _href_ attribute and a _title_ attribute.
        + __properties__: Object where all the properties of this resource are stored. Every property will be an object itself containing attributes such as the _value_, _required_ or _editable_ among others.
        + __creatable__: Boolean flag that indicates whether or not this resource allows a _POST_ on it.
        + __deletable__: Boolean flag that indicates whether or not this resource allows a _DELETE_ on it.
        + __patchable__: Boolean flag that indicates whether or not this resource allows a _PATCH_ on it.

_1. Getting into too much detail about this objects would make it more unclear, so we recommend to debug the code and inspect the objects on the browser._

_2. Helper methods for preparing the rendering objects can be seen directly in the code, where they are well commented._

### Events

> Since the renderer will be used inside other components (like the _renderer_ itself or the _popup_), it will have to listen to some events ([_reset\_renderer_](#reset_renderer), [_patch\_renderer_](#patch_renderer)) in order to reset the data it is being shown or to patch the values that have changed so far.

###### resource_directory
The resourceDirectory event is broadcasted every time the resource directory gets updated, so it is thrown by the resource factory after every _GET_, _PATCH_, _POST_ or _DELETE_ operation that involves an interaction with the backend (when a GET returns a cached result the event is not thrown). A common use for this event is to listen to it in order to know when a resource has changed and, therefore, when a component will have to refresh.

###### reset_renderer
This event is broadcasted from the _popup_ directive reset action and is listened to from the _renderer_ directive. By doing so, the _renderer_ will patch the links passed within the arguments to an empty string in order to reset them.

###### patch_renderer
As of today, this event is broadcasted from the _popup_ directive save action and is listened to from the _renderer_ directive. The _popup_ will specify the resource url to patch and then any renderer bound to that url will trigger a patch on all the entities being shown by him at that moment in time.

###### close_popUp_renderer
This event is thrown by the _popup_ to pass the renderer a callback to be executed when the popup gets closed.

###### refresh_popUp
The _refresh_popUp_ event is used to prepare the data that the popup will have to show.

When a popup is closed it does not disappear from the HTML code, it stills underneath, so opening again the same resource will show the values it had when the popup got closed. In most cases that is not a problem, but if the resource got updated between those 2 opens of the popup it will probably display the data we don't want.

If we can anticipate those cases, we could broadcast this event to force the refresh of the popup's data.

###### refresh_table 
This event is similar to the [_refresh_popUp_](#refresh_popup) event.

In some cases updating a resource will impact the resources within a collection or the collection itself, event if the updated resource is not contained in that collection. Since a collection listens only to itself or its items, it will not notice when it has to refresh the data.

