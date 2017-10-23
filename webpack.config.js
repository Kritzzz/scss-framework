var config = require('./config.json');

module.exports = {
	entry: config.scripts.entry,
	devtool: 'inline-source-map',
	output: {
		filename: config.scripts.outputName
	},
}
