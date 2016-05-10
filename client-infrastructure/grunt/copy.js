'use strict';

module.exports = {
  dist : {
    files: [
     {
      expand: true , cwd:'tmp/' , flatten: true,  filter: 'isFile',
      dest: 'dist/ocInfra/js' ,
      src: ['js/*.js']
     },
     {
      expand: true , cwd:'tmp/' , flatten: true,  filter: 'isFile',
      dest: 'dist/ocInfra/css' ,
      src: ['css/*.css']
     },
     {
      expand: true , cwd:'src/ocInfra/' , flatten: false,  filter: 'isFile',
      dest: 'dist/ocInfra/' ,
      src: ['assets/**']
     },
      {
      expand: true , cwd:'src/ocInfra/' , flatten: false,  filter: 'isFile',
      dest: 'dist/ocInfra/' ,
      src: ['templates/**']
     },
   ]
  },
   dist_clientmanagement : {
    files: [
     {
      expand: true , cwd:'tmp/' , flatten: true,  filter: 'isFile',
      dest: 'src/app-clientmanagement/ocInfra/js' ,
      src: ['js/*.js']
     },
     {
      expand: true , cwd:'tmp/' , flatten: true,  filter: 'isFile',
      dest: 'src/app-clientmanagement/ocInfra/css' ,
      src: ['css/*.css']
     },
     {
      expand: true , cwd:'src/ocInfra/' , flatten: false,  filter: 'isFile',
      dest: 'src/app-clientmanagement/ocInfra/' ,
      src: ['assets/**']
     },
      {
      expand: true , cwd:'src/ocInfra/' , flatten: false,  filter: 'isFile',
      dest: 'src/app-clientmanagement/ocInfra/' ,
      src: ['templates/**']
     },
   ]
  },
  dist_kitchensink : {
    files: [
     {
      expand: true , cwd:'tmp/' , flatten: true,  filter: 'isFile',
      dest: 'src/app-kitchensink/ocInfra/js' ,
      src: ['js/*.js']
     },
     {
      expand: true , cwd:'tmp/' , flatten: true,  filter: 'isFile',
      dest: 'src/app-kitchensink/ocInfra/css' ,
      src: ['css/*.css']
     },
     {
      expand: true , cwd:'src/ocInfra/' , flatten: false,  filter: 'isFile',
      dest: 'src/app-kitchensink/ocInfra/' ,
      src: ['assets/**']
     },
      {
      expand: true , cwd:'src/ocInfra/' , flatten: false,  filter: 'isFile',
      dest: 'src/app-kitchensink/ocInfra/' ,
      src: ['templates/**']
     },
   ]
  },
  dist_weather : {
    files: [
     {
      expand: true , cwd:'tmp/' , flatten: true,  filter: 'isFile',
      dest: 'src/app-weather/ocInfra/js' ,
      src: ['js/*.js']
     },
     {
      expand: true , cwd:'tmp/' , flatten: true,  filter: 'isFile',
      dest: 'src/app-weather/ocInfra/css' ,
      src: ['css/*.css']
     },
     {
      expand: true , cwd:'src/ocInfra/' , flatten: false,  filter: 'isFile',
      dest: 'src/app-weather/ocInfra/' ,
      src: ['assets/**']
     },
      {
      expand: true , cwd:'src/ocInfra/' , flatten: false,  filter: 'isFile',
      dest: 'src/app-weather/ocInfra/' ,
      src: ['templates/**']
     },
   ]
  },
   dist_miniquote : {
    files: [
     {
      expand: true , cwd:'tmp/' , flatten: true,  filter: 'isFile',
      dest: 'src/app-miniquote/ocInfra/js' ,
      src: ['js/*.js']
     },
     {
      expand: true , cwd:'tmp/' , flatten: true,  filter: 'isFile',
      dest: 'src/app-miniquote/ocInfra/css' ,
      src: ['css/*.css']
     },
     {
      expand: true , cwd:'src/ocInfra/' , flatten: false,  filter: 'isFile',
      dest: 'src/app-miniquote/ocInfra/' ,
      src: ['assets/**']
     },
      {
      expand: true , cwd:'src/ocInfra/' , flatten: false,  filter: 'isFile',
      dest: 'src/app-miniquote/ocInfra/' ,
      src: ['templates/**']
     },
   ]
  },
  dist_mobile : {
    files: [
	{
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/' ,
      src: ['app-miniquote/**/*']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular/angular.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-animate/angular-animate.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-bootstrap/*.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-bootstrap-colorpicker/css/colorpicker.min.css']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-bootstrap-colorpicker/img/*']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-cookies/*.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-dynamic-locale/dist/tmhDynamicLocale.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-growl/build/angular-growl.min.css']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-growl/build/angular-growl.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-i18n/angular-locale_en.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-i18n/angular-locale_en-gb.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-i18n/angular-locale_en-us.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-i18n/angular-locale_es.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-i18n/angular-locale_es-us.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-i18n/angular-locale_fr.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-i18n/en-us.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-i18n/es-es.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-i18n/es-us.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-i18n/fa.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-motion/dist/*.min.css']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-motion/dist/modules/*.min.css']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-resource/angular-resource.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-route/angular-route.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-sanitize/angular-sanitize.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-smart-table/dist/smart-table.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-strap/dist/*.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-strap/dist/*.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-ui/build/*.min.*']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-ui-date/src/date.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-ui-mask/dist/mask.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-ui-select/dist/*.min.*']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/bootbox/bootbox.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/bootstrap/dist/css/*.min.css']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/bootstrap/dist/fonts/*']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/bootstrap/dist/js/*.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/flaticon/*']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/font-awesome/css/font-awesome.min.css']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/font-awesome/fonts/*']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/jasny-bootstrap/dist/css/jasny-bootstrap.min.css']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/jasny-bootstrap/dist/js/jasny-bootstrap.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/jquery/dist/jquery.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/jquery-ui/jquery-ui.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/jquery-ui/themes/base/jquery-ui.min.css']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/jquery-ui/themes/base/images/*']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/jquery-validation/dist/*.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/lodash/dist/*.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/lodash/dist/*.fp.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/modernizr/modernizr.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/modernizr/feature-detects/*']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/open-sans/css/open-sans.min.css']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/open-sans/fonts/bold/*']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/open-sans/fonts/regular/*']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/quick-ng-repeat/quick-ng-repeat.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/restangular/dist/restangular.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/select2/select2.css']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/select2/select2.min.js']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/select2/select2.png']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/select2/select2-spinner.gif']
     },
    {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['ocInfra/css/**/*']
     },
	 {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/select2/select2x2.png']
     },
     {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/bootstrap-tour/build/css/bootstrap-tour-standalone.css']
     },
     {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/bootstrap-tour/build/css/bootstrap-tour.css']
     },
     {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/bootstrap-tour/build/js/bootstrap-tour-standalone.min.js']
     },
     {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/bootstrap-tour/build/js/bootstrap-tour.min.js']
     },
     {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-growl-v2/build/angular-growl.min.js']
     },
     {
      expand: true , cwd:'src/' , flatten: false,
      dest: 'mobile/app-miniquote/' ,
      src: ['vendors/angular-growl-v2/build/angular-growl.min.css']
     },
   ]
  },
};