'use strict';

if (process.type === 'renderer') {
	module.exports = require('./src/renderer');
} else {
	module.exports = require('./src/main');
}
