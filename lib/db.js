var mysql = require('mysql');

// var connection = mysql.createConnection({
// 	host: process.env.MYSQL_HOST,
// 	port: process.env.MYSQL_PORT,
// 	user: process.env.USERNAME,
// 	password: process.env.MYSQL_PASSWORD,
// 	database: process.env.MYSQL_DATABASE
// });

var connection = mysql.createConnection({
	host: 'venom.synology.me',
	port: 3307,
	database: 'crudnodejs',
	user: 'crudnodejs',
	password: 'ImKr72lSeLTqmeBn@'
});

connection.connect(function(error){
	if(!!error) {
		console.log('Erro:' + error);
	} else {
		console.log('Conectado ao banco de dados!');
	}
});

module.exports = connection;