'use strict';

module.exports = {
  pack: {
	options: {
	  mode: 'tgz',
	  archive: 'dist/omnichannel-ui.tar.gz'
	},
	expand: true,
	cwd: 'src/',
	src: ['**/*'],
  }
};

