'use strict';
module.exports = {
            dev: {
                options: {
                    style: 'expanded'
                },
                 files: {
					'src/ocInfra/css/omniColor.css': 'src/ocInfra/assets/sass/omniColors.scss'
				}
            },
            dist: {
                options: {
                    style: 'compressed'
                },
               files: {
					'omniColor.css': 'omniColor.scss'
				}
            }
   
};