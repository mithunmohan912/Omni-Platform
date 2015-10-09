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
   }
};