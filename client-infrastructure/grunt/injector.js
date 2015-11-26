'use strict';

module.exports = {
    injector: {
        options: {
            relative: true,
            min: true
        },
        files: {
            'src/app-clientmanagement/index.html': ['src/app-clientmanagement/js/*.js',
                                                    'src/app-clientmanagement/js/**/*.js',
                                                    'src/app-clientmanagement/app/*.js',
                                                    'src/app-clientmanagement/app/**/*.js',  
                                                    'src/app-clientmanagement/assets/css/*.css',
                                                    'src/app-clientmanagement/ocInfra/js/ocInfra.js', 
                                                    'src/app-clientmanagement/ocInfra/css/ocInfra.css'
            ],
            'src/app-kitchensink/index.html': ['src/app-kitchensink/js/*.js',
                                                    'src/app-kitchensink/js/**/*.js',
                                                    'src/app-kitchensink/app/*.js',
                                                    'src/app-kitchensink/app/**/*.js',  
                                                    'src/app-kitchensink/assets/css/*.css',
                                                    'src/app-kitchensink/ocInfra/js/ocInfra.js', 
                                                    'src/app-kitchensink/ocInfra/css/ocInfra.css'
            ],
            'src/app-miniquote/index.html': ['src/app-miniquote/js/*.js',
                                             'src/app-miniquote/js/**/*.js',
                                             'src/app-miniquote/app/*.js',
                                             'src/app-miniquote/app/**/*.js',  
                                             'src/app-miniquote/assets/css/*.css',
                                             'src/app-miniquote/ocInfra/js/ocInfra.js', 
                                             'src/app-miniquote/ocInfra/css/ocInfra.css'
            ],
            'src/app-weather/index.html': ['src/app-weather/js/*.js',
                                           'src/app-weather/js/**/*.js',
                                           'src/app-weather/app/*.js',
                                           'src/app-weather/app/**/*.js', 
                                           'src/app-weather/assets/css/*.css',
                                           'src/app-weather/ocInfra/js/ocInfra.js', 
                                           'src/app-weather/ocInfra/css/ocInfra.css'
            ]
        }

    },
    bower_injector: {
        options: {
            relative: true,
            min: true,
            starttag: '<!-- bower_injector:{{ext}} -->',
            endtag: '<!-- endbower_injector -->'
        },
        files: {
            'src/app-clientmanagement/index.html': ['bower.json'],
            'src/app-miniquote/index.html': ['bower.json'],
            'src/app-weather/index.html': ['bower.json'],
            'src/app-kitchensink/index.html': ['bower.json'],
        }
    }
};