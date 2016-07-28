'use strict';

module.exports = {
	replace_clientmanagement: {
 	 	 src: ['src/app-clientmanagement/index.html'],
   		 overwrite: true,                
  	     replacements: [{
      	 from: '.\/vendors',
         to: '..\/vendors'
      }]
   },
   replace_kitchensink: {
     src: ['src/app-kitchensink/index.html'],
       overwrite: true,                
         replacements: [{
         from: '.\/vendors',
         to: '..\/vendors'
      }]
   },
   replace_miniquote: {
 	 	 src: ['src/app-miniquote/index.html'],
   		 overwrite: true,                
  	     replacements: [{
      	 from: '.\/vendors',
         to: '..\/vendors'
      }]
   },
   replace_weather: {
 	 	 src: ['src/app-weather/index.html'],
   		 overwrite: true,                
  	     replacements: [{
      	 from: '.\/vendors',
         to: '..\/vendors'
      }]
   },
   replace_reference: {
       src: ['src/app-reference/index.html'],
          overwrite: true,                
        replacements: [{
          from: '".\/vendors',
         to: '"..\/vendors'
      }]
   },
   replace_omnichannel: {
     src: ['src/app-omnichannel/index.html'],
       overwrite: true,                
         replacements: [{
         from: '".\/vendors',
         to: '"..\/vendors'
      }]
   },
   replace_mobile: {
 	 	 src: ['mobile/app-miniquote/index.html'],
   		 overwrite: true,                
  	     replacements: [{
      	 from: '..\/vendors',
         to: 'vendors'
      },
	  {
      	 from: '..\/ocInfra',
         to: 'ocInfra'
      },
	  {
      	 from: 'colorpicker.css',
         to: 'colorpicker.min.css'
      },
	  {
      	 from: 'bootstrap.css',
         to: 'bootstrap.min.css'
      },
	  {
      	 from: 'angular-motion.css',
         to: 'angular-motion.min.css'
      },
	  {
      	 from: 'select.css',
         to: 'select.min.css'
      },
	  {
      	 from: 'jasny-bootstrap.css',
         to: 'jasny-bootstrap.min.css'
      },
	  {
      	 from: 'font-awesome.css',
         to: 'font-awesome.min.css'
      },
	  {
      	 from: 'open-sans.css',
         to: 'open-sans.min.css'
      },
	  {
      	 from: '.js',
         to: '.min.js'
      },
	  	  {
      	 from: 'angular-dynamic-locale/src',
         to: 'angular-dynamic-locale/dist'
      },
	  {
      	 from: 'vendors/lodash',
         to: 'vendors/lodash/dist'
      },
	  {
      	 from: 'modernizr.min.js',
         to: 'modernizr.js'
      },
	 {
      	 from: 'factory.min.js',
         to: 'factory.js'
      },
	  {
      	 from: 'ocInfra.min.js',
         to: 'ocInfra.js'
      },
	  {
      	 from: 'bootbox.min.js',
         to: 'bootbox.js'
      },
	  {
      	 from: 'app.min.js',
         to: 'app.js'
      },
	  {
      	 from: 'quick-ng-repeat.min.js',
         to: 'quick-ng-repeat.js'
      },
	  {
      	 from: 'LoadConfig.min.js',
         to: 'LoadConfig.js'
      },
	  {
      	 from: 'DataMappingService.min.js',
         to: 'DataMappingService.js'
      },
	 {
      	 from: 'src/date.min.js',
         to: 'src/date.js'
      },
      {
          from: 'AnonymousController.min.js',
         to: 'AnonymousController.js'
      },
      {
          from: 'angular-growl.css',
         to: 'angular-growl.min.css'
        
      },
      {
          from: 'angular-growl.js',
         to: 'angular-growl.min.js'
         
      }
	  ]
   },
   replace_mobile_appjs: {
   src: ['mobile/app-miniquote/app/app.js'],
   		 overwrite: true,                
  	     replacements: [{
      	 from: '..\/vendors\/angular-i18n\/angular-locale_{{locale}}.js',
         to: '..\/app-miniquote\/vendors\/angular-i18n\/angular-locale_{{locale}}.js'
      }]
	}
};