const config = require('./config.js');

module.exports = {
	entry: config.scripts.entry,
	devtool: config.jsSourcemap ? 'source-map' : false,
	output: {
		filename: config.scripts.outputName
	}
};
