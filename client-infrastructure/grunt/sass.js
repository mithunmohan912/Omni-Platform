'use strict';
module.exports = {
            dev: {
                options: {
                    style: 'expanded'
                },
                 files: {
					'src/ocInfra/css/mystyle.css': 'src/ocInfra/assets/saas/mystyle.scss'
				}
            },
            dist: {
                options: {
                    style: 'compressed'
                },
               files: {
					'mystyle.css': 'mystyle.scss'
				}
            }
   
};