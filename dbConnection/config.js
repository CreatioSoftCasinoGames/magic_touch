
if (['prod', 'production'].indexOf(process.argv[process.argv.length-1])>=0) {
	module.exports = {
		host : '10.130.87.150',
		port : 27017,
		db_name : 'magicTouch'
	};
} else {
	module.exports = {
		host : '192.168.2.196',
		port : 27002,
		db_name : 'magicTouch'
	};
}