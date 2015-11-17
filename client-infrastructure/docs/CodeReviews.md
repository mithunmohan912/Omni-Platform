Common Messages with JsHint Code Review
----------------------

For any issues/queries or addition , Contact @smandal8 `Sadanand Mandal`

Below are few pointers and best practices , in case you face one of the issues with code implementation 

###Use three equals(===) instead of two equals(==) 
---
In a conditional statement , for equality check , three equals `===` should be used instead
of two equals `==`. 

This way JShint prohibits the use of `==` and `!=` in favor of `===` and `!==`. The former try to coerce values before comparing them which can lead to some unexpected results. The latter don't do any coercion so they are generally safer. 

Example -

```
#!javascript
//compliant
 if (status === 401) {
     $rootScope.logout();
 }

//non-compliant
 if (status == 401) {
     $rootScope.logout();
 }

```

###Use **!==** instead of **!=** 
---

In a conditional statement ,for Inequality check `!==` should be used instead of `!=`. 

As a Best Practices in javascripts `!==` is used to check not "equal value or not equal type" .

Example -

```
#!javascript

//compliant
if(key.type !== 'table'){
     key.visible = false;
   }

//non-compliant
if(key.type != 'table'){
     key.visible = false;
   }
```
###Prefer using **Single quote** over **double Quote**  for declaring string
---

When declaring a string as variable, prefer use of single quotes over double quotes. This brings in consistency through out the code in app.
Example -

```
#!javascript

    $scope.remove = 'remove';  // compliant
    $scope.remove = “remove”;  // non-compliant

```

###**Unused** variables
---

When defining functions, be careful!! .Don’t declare variables as argument or local variable which are not used in entire function body. JSHint will notify you immediately.

Example -

```
#!javascript
  
//Non-Compliant Code
//Variable `val` is not used in entire function body.
    angular.forEach(subsection.element, function(key , val){
         if(key.type !== 'table'){
             key.visible = true;
           }
     }); 

//Compliant Code
    angular.forEach(subsection.element, function(key){
         if(key.type !== 'table'){
             key.visible = true;
           }
     }); 

```
###Global variable/functions
---

Global functions and variables are consolidated and defined in one JavaScript file but frequently used across the application. JsHint usually mark such variables/functions as defined unused. 

     `'app' is not defined`

     `'screenCtrl' is defined but not used`
    
     `'showMessage' is not defined`

It is recommended that Global variables are declared as global/exported within comments so that JsHint can acknowledge the scope of variable.

Add a Comment on top of the file as below-

```
#!javascript
//Export Global Functions
  /*exported ScreenCtrl*/
//Declare a Global Variable in js
  /* global app*/


```

###eval can be harmful
---
To evaluate any javaScript expression eval function should be avoid. The use of `eval` is dis-couraged because it can make your code vulnerable to various injection attacks and it makes it hard for JavaScript interpreter to do certain optimizations.

if anywhere eval is used, JsHint throw such as warnings-
            
`eval can be harmful.`

### Missing "use strict" statement.
---
JsHint requires you to use function-level strict mode in your code. but it's allowed to set it globally for each file, at top of file as-
`'use strict';`

Strict mode helps out in a couple ways:

* It catches some common coding bloopers, throwing exceptions.
* It prevents, or throws errors, when relatively "unsafe" actions are taken (such as gaining access to the global object).
* It disables features that are confusing or poorly thought out.