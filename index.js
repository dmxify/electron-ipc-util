'use strict';

/**
*	electron-ipc-util module.
* @module electron-ipc-util
*/

if (process.type === 'renderer') {
	module.exports = require('./src/renderer');
} else {
	module.exports = require('./src/main');
}
