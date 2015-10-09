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
      src: ['assets/**' , '!assets/css/**']
     },
      {
      expand: true , cwd:'src/common/views' , flatten: false,  filter: 'isFile',
      dest: 'dist/ocInfra/' ,
      src: ['templates/**']
     },
   ]
  },
   dist_clientmanagement : {
    files: [
     {
      expand: true , cwd:'tmp/' , flatten: true,  filter: 'isFile',
      dest: 'src/app-clientmanagement/ocinfra/js' ,
      src: ['js/*.js']
     },
     {
      expand: true , cwd:'tmp/' , flatten: true,  filter: 'isFile',
      dest: 'src/app-clientmanagement/ocinfra/css' ,
      src: ['css/*.css']
     },
     {
      expand: true , cwd:'src/' , flatten: false,  filter: 'isFile',
      dest: 'src/app-clientmanagement/ocinfra/' ,
      src: ['assets/**' , '!assets/css/**']
     },
      {
      expand: true , cwd:'src/common/views' , flatten: false,  filter: 'isFile',
      dest: 'src/app-clientmanagement/ocinfra/' ,
      src: ['templates/**']
     },
   ]
  },
  dist_weather : {
    files: [
     {
      expand: true , cwd:'tmp/' , flatten: true,  filter: 'isFile',
      dest: 'src/app-weather/ocinfra/js' ,
      src: ['js/*.js']
     },
     {
      expand: true , cwd:'tmp/' , flatten: true,  filter: 'isFile',
      dest: 'src/app-weather/ocinfra/css' ,
      src: ['css/*.css']
     },
     {
      expand: true , cwd:'src/' , flatten: false,  filter: 'isFile',
      dest: 'src/app-weather/ocinfra/' ,
      src: ['assets/**' , '!assets/css/**']
     },
      {
      expand: true , cwd:'src/common/views' , flatten: false,  filter: 'isFile',
      dest: 'src/app-weather/ocinfra/' ,
      src: ['templates/**']
     },
   ]
  },
   dist_miniquote : {
    files: [
     {
      expand: true , cwd:'tmp/' , flatten: true,  filter: 'isFile',
      dest: 'src/app-miniquote/ocinfra/js' ,
      src: ['js/*.js']
     },
     {
      expand: true , cwd:'tmp/' , flatten: true,  filter: 'isFile',
      dest: 'src/app-miniquote/ocinfra/css' ,
      src: ['css/*.css']
     },
     {
      expand: true , cwd:'src/' , flatten: false,  filter: 'isFile',
      dest: 'src/app-miniquote/ocinfra/' ,
      src: ['assets/**' , '!assets/css/**']
     },
      {
      expand: true , cwd:'src/common/views' , flatten: false,  filter: 'isFile',
      dest: 'src/app-miniquote/ocinfra/' ,
      src: ['templates/**']
     },
   ]
  },
};