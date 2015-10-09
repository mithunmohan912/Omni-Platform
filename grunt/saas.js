'use strict';
module.exports = {
            dev: {
                options: {
                    style: 'expanded'
                },
                 files: {
					'src/assets/css/mystyle.css': 'src/assets/saas/mystyle.scss'
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