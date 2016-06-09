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
* [2. Table](#2-table)
    - [2.1 Table usage](#21-table-usage)
    - [2.2 Table metamodel](#22-table-metamodel)
    - [2.3 Table metamodel properties](#23-table-metamodel-properties)
        + [2.3.1 Table label](#231-table-label)
        + [2.3.2 Table literal](#232-table-literal)
        + [2.3.3 Table icon](#233-table-icon)
        + [2.3.4 Table status](#234-table-status)
        + [2.3.5 Table actions](#235-table-actions)
* [3. Pop up](#3-pop-up)
    - [3.1 Pop up metamodel example](#31-pop-up-metamodel-example)
    - [3.2 Pop up directive usage](#32-pop-up-directive-usage)
    - [3.3 Pop up code example](#33-pop-up-code-example)
* [4. Input](#4-input)
    - [4.1 Input directive usage](#41-input-directive-usage)
    - [4.2 Input metamodel example](#42-input-metamodel-example)
    - [4.3 Input metamodel structure](#43-input-metamodel-structure)
    - [4.4 Input metamodel attributes and options](#44-input-metamodel-attributes-and-options)
        + [4.4.1 Autocomplete](#441-autocomplete)
        + [4.4.2 Decimal](#442-decimal)
        + [4.4.3 Money](#443-money)
        + [4.4.4 Email](#444-email)
        + [4.4.5 Number](#445-number)
        + [4.4.6 Percentage](#446-percentage)
        + [4.4.7 Select](#447-select)
        + [4.4.8 TextMask](#448-textmask)
        + [4.4.9 Text](#449-text)
        + [4.4.10 Textarea](#4410-textarea)
        + [4.4.11 Toggle](#4411-toggle)
        + [4.4.12 Date](#4412-date)
        + [4.4.13 Checkbox](#4413-checkbox)
        + [4.4.14 Label](#4414-label)
* [Metamodels](#metamodels)

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

• **title**: Text to display as the title of the section. A key contained in a i18n file can be used also.
• **underline**: Boolean representing whether or not the title should be underlined.
• **row**: Number (1-based) of the row where the section will have to be placed. This allows the sections to not be correlatives, since you can define a section anywhere and then it will be inserted in the right row.
• **colspan**: Number that represents the number of columns that the section will use. It uses bootstrap underneath, so the maximum colspan is 12. The minimum colspan is not 1, as it could be expected, but 3 because we do not want to allow more than 4 sections per row (more sections wouldn’t be user friendly since the content would be so small).
• **properties**: Array containing json objects that define the content displayed within the section. The object attributes vary from one to another depending on the directive that is going to interpret them (table, input, etc.)
• **resourceUrl**: This is intended to be used in the first screen. It represents the first API call when launching the application. 
The renderer could include other renderer component. This is handled using a section type reference in the metamodel:
• **$ref and type**: This twon properties allows to link antoher metamodel file that will be handled by another render instance. 

Example:

	{
	    "metamodel": {
	        "sections": [
	            {
	                "$ref": "quote_data",
	                "type": "reference"
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
- action: Action to execute onclick. 
   	 
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


### 2. Table
- - - -
This angular directive is in charge of rendering tables. The component is able to retrieve its data from a url and may use the [popup](#3-pop-up) component to modify the collection.

#### 2.1 Table usage

The table renderer directive has an isolate scope and it is restricted to elements. The directive attributes are:

* resourceUrl: API resource url containing the collection.
* metamodel: Metamodel file relative path.
* factoryName: Custom Factory defined for custom screen actions.

Example:

    <table-render resource-url="resourcesToBind[column.id].href" metamodel="column.metamodel" factory-name="factoryName"></table-render>
    


#### 2.2 Table metamodel

The metamodel definition by default is as follows, a metamodel element that could include the folowing attributes:

* __name__: name to link the actions in the table and the popup component.
* __searching__: flag to show the searching input at the top of the table.
* __pagination__: flag to show the pagination footer.
* __buttonLabel__: the button that could be included at the bottom of the table to add a new item to the collection.
* __modalRef__: metadata file relative path that includes the metadata definition for the popup. These last two attributes are mandatory only if the table has to include a modal screen.
* __header__: flag to indicate whether the table has to shown a header or not.
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


#### 2.3 Table metamodel properties
Depending on the property type, its metadata definition can be slightly different. These are the common attributes:

* __id__: Name of the backend property that will be displayed. In some cases, this property can be an array of names.
* __label_header__: Text or key in the i18n file representing the column header to use when there is not a header section specified for the table.
* __align__: the align property value for the table column.
* __width__: the width property value for the table column.
* __type__: Text used to indicate the type of cell that will have to be displayed. Some possible values are explained in the folowing sections.

##### 2.3.1 Table label

Label type used to display the value of the property specified in the *id* attribute that could be an array of ids. It would be also posible to specify an attribute *format*, for example 'dd/MM/YYYY' for a date.

Example:

            {
                "id": "quote:identifier",
                "label_header": "_NUMBER",
                "type": "label",
                "align": "left",
                "width": "10%"
            }

##### 2.3.2 Table literal

Literal type used to render the *id* value directly in the table cell, it may be a text or key in the i18n file.

Example:

            {
                "id": "_DRIVER",
                "label_header": "_ROLE",
                "type": "literal",
                "align": "left",
                "width": "10%"
            }


##### 2.3.3 Table icon

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


##### 2.3.4 Table status

Status type used to insert an icon displaying the entity backend status of the resource.

Example:

            {
                "label": "",
                "type": "status",
                "align": "center",
                "width": "5%"
            }

##### 2.3.5 Table Actions

Action type defines a list of actions to be included for each item in the table. It is required by every action to add an element in the *options* attribute containing the following fields:

* __value__: the name of the action. The component provides two default actions that can be used:
    - edit: open the modal window with the item selected
    - delete: remove the item selected from the collection
* __title__: optional, text that could be displayed as a link. 
* __icon__: optional, image of the action.
* __method__: optional, name of the function in the custom factory that is going to overwrite the default action.

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

_Since the table uses the [input](#4-input) renderer underneath, it could be possible to render in a cell any type allowed by the component, as well as any behavior allowed by it such as the patch of the property._

### 3. Pop Up
- - - -

This component handles the screen section expected to be renderized inside a modal window. It usually appears with a button group to trigger some actions related to its form data and a "X" button to close the modal. 

The metamodel definition interpreted by a pop up can include the follow attributes:

•	**actions**: defines the functions to be executed by the popup buttons. This actions will override the popup default actions.
•	**labels**: object which properties define the text (or key in i18n file) used for the title and buttons of the popup.
•	**sections**: similar to the renderer directive.
•	**actions**: Actions that can be triggered form the pop up:
	- reset:
		+ links: resource links to be unpatched 
		+ callback: custom action to be executed afeter the default behaviour. 
	- ok: Action to be executed from ok accept button.
		+  callback: custom action to be executed afeter the default behaviour.
	- close: Action to be executed from X button.
		+ callback: custom action to be executed afeter the default behaviour.
		
####3.1 Pop up metamodel example:

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

####3.2 Pop up directive usage:

The popup renderer directive has an isolate scope and it is restricted to elements. Its scope option contains the following properties:

-**ui-id**: modal window id selector. 
-**metamodel**: Metamodel file relative path.
-**factoryName**: Custom Factory defined for custom screen actions. 
-**resourceUrl**: API resource (optional).

####3.3 Pop up code example:

	<popup-render ui-id="modal_{{metamodelObject.name}}" metamodel="metamodelObject.modalRef" resource-url="itemSelected.href" factory-name="factoryName"></popup-render>

### 4. Input
- - - -
The input directive is the component in charge of rendering properties (coming from backend or even if they are UI-only fields), setting the appropriate constraints when necessary (such as when the property is required or if it is editable or not among others). For that, this component uses 1 controller for all types of inputs, some directives for things such as formatting or decimal numbers, 1 input html template out of the set of templates available, and a metamodel defined in JSON format. Its distribution in the repository is as follows:
	
* __Directives and input controller__: Under `src/ocInfra/js/components` you may find _input.js_, _capitalize.js_, _decimal-input.js_ and _format-date.js_.

* __HTML templates__: Located under `src/ocInfra/templates/components` you may find several html templates prefixes with the word _input_ as well as _backend-error-display.html_ and _help-tooltip-display.html_, which are used to display errors and help tooltips respectively.

#### 4.1 Input directive usage
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

#### 4.2 Input metamodel example
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

#### 4.3 Input metamodel structure

* __Id__: Explained [here](#41-input-metamodel-example).
* __Type__: Explained [here](#41-input-metamodel-example).
* __Name__: _Optional_. String to be used in the name HTML attribute of the input element. If not present, the _id_ will be used as name.
* __Label__: _Optional_. String or i18n key to be used as the input label. If present it will use 4 bootstrap columns and if not present the input will span the whole space (12 columns).
* __Placeholder__: _Optional_. String or i18n key to be used in the input's placeholder.
* __PatchOnBlur__: _Optional_. Boolean flag that indicates whether or not we should patch a property when its value changes or when the input loses the focus. To know when the patch has to be triggered it uses the directive attribute [_update-mode_](#41-input-directive-usage).
* __Visible__: _Optional_. Boolean flag used to overwrite the input's visibility. By default the input is always visible.
* __VisibleWhen__: _Optional_. Object that contains one or several expressions that will be evaluated in order to determine the visibility of the field.
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

#### 4.4 Input metamodel attributes and options
This sections specifies the available properties within the _attributes_and _options_ objects of the metamodels.

##### 4.4.1 Autocomplete

###### Attributes
* __typeahead-wait-ms__: Number. Minimum amount of milliseconds to wait before firing the search method to get the data that will have to be shown in the dropdown.
* __typeahead-focus-first__: Boolean. Whether or not the focus should be set on the first value of the dropdown.
* __typeahead-min-length__: Number. Minimum amout of characters that must be in the input in order to fire the search method.
* __maxlength__: Number. Maximum number of characters that the input can hold.
* __capitalize__: Boolean. Whether or not the values should be upper case. If it is false, then the dropdown values will be the same returned by the search method without any modification.

###### Options
* __getData__: String. Name of the method that will be in charge of getting the data for the autocomplete’s dropdown. The directive cannot infer any default behavior.
* __select__: String. Name of the method to use when a value of the dropdown has been selected. Again the directive cannot provide a default functionality in this case.
* __typeaheadBlur__: String. Name of the method to invoke when the typeahead loses the focus. By default, the method configures the dropdown to not be shown again, preventing this way the possibility that an asynchronous getData makes it displays when the user is no longer on that input. Please notice two things:
    - The onUpdate (potentially the default patch on blur) method gets invoked first and then the typeaheadBlur gets invoked.
    - Any method overriding this one may want to take care of hiding the dropdown as the default behavior does.
* __typeaheadFocus__: String. Name of the method to be invoked when the input gets the focus. The default functionality is to enable the dropdown to be shown (counteract the default typeaheadBlur).

###### Default values
| typeahead-wait-ms | typeahead-focus-first | typeahead-min-length | maxlength | capitalize |
|-------------------|-----------------------|----------------------|-----------|------------|
|       1000        |         false         |           3          |  9999999  |    false   |

##### 4.4.2 Decimal

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

##### 4.4.3 Money

###### Attributes
* __currency__: String. Short name of the currency icon that is going to be shown alongside the input. Possible currencies are: _eur_, _usd_, _gbp_, _yen_, _rub_ and _won_.
* Since this input holds decimal values, the attributes for the [decimal input](#442-decimal) apply here.

###### Options
>_None._

###### Default values
| currency |
|----------|
|    eur   |

##### 4.4.4 Email

###### Attributes
* __maxLength__: Number. Maximum amount of characters that the input can hold.

###### Options
>_None._

###### Default values
| maxLength |
|-----------|
|  9999999  |

##### 4.4.5 Number

###### Attributes
* __min__: Number. Minimum number allowed.
* __max__: Number. Maximum number allowed.


###### Options
>_None._

###### Default values
| min |   max   |
|-----|---------|
|  0  | 9999999 |

##### 4.4.6 Percentage

###### Attributes
This type uses the same attributes as the [decimal input](#442-decimal).

###### Options
>_None._

##### 4.4.7 Select

###### Attributes
* __capitalize__: Boolean. Whether or not the values of the select and the selected value should be all upper case.

###### Options
* __getData__: String. Name of the method that will be invoked to get the data that will be shown in the select dropdown. By default, the input fills the select with the values of the enum attribute present in the property it is bounded to.

###### Default values
| capitalize |
|------------|
|   false    |

##### 4.4.8 TextMask

###### Attributes
* __capitalize__: Boolean. Whether or not the text should be transformed to upper case.
* __mask__: String. Pattern to mask the text with.

###### Options
>_None._

###### Default values
| capitalize |      mask      |
|------------|----------------|
|   false    | _Empty string_ |

##### 4.4.9 Text

###### Attributes
* __capitalize__: Boolean. Whether or not the text should be transformed to upper case.
* __maxLength__: Number. Maximum number of characters that the input can hold.

###### Options
>_None._

###### Default values
| capitalize | maxlength |
|------------|-----------|
|   false    |  9999999  |

##### 4.4.10 Textarea

###### Attributes
* __maxLength__: Number. Maximum number of characters that the input can hold.

###### Options
>_None._

###### Default values
| maxlength |
|-----------|
|  9999999  |

##### 4.4.11 Toggle

###### Attributes
* __true_label__: String. Text to be displayed alongside the ‘true’ value of the input. This text will be translated using the i18n resource files.
* __false_label__: String. Counterpart of the true_label but for the ‘false’ value of the input. The text will be translated using i18n resource files.

###### Options
>_None._

###### Default values
| true_label | false_label |
|------------|-------------|
|   _TRUE    |   _FALSE    |

##### 4.4.12 Date

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

##### 4.4.13 Checkbox

###### Attributes
>_None._

###### Options
>_None._

##### 4.4.14 Label
This type is not strictly an input since it only displays data. However, it is rendered by the input directive for simplicity. Due to the fact that it is going to render any type of data as a read-only field, it allows different parameters for customizing the label.

###### Attributes
* __icon__: _Font awesome_ class used to show an image at the end of the label. I.e: EUR symbol.
* __class__: Class name used to add styling to the label.
* __format__: For dates only. Used to specify the date format. The backend metadata is used in order to determine whether or not the data is a date.

###### Options
>_None._

##Metamodels
Omnichannel projects metamodel are a set of json files specifying the layout and some features contained in the application screens, sections, modals..etc