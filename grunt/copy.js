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
      expand: true , cwd:'src/' , flatten: false,  filter: 'isFile',
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
      expand: true , cwd:'src/' , flatten: false,  filter: 'isFile',
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
      expand: true , cwd:'src/' , flatten: false,  filter: 'isFile',
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
      expand: true , cwd:'src/' , flatten: false,  filter: 'isFile',
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
};