var express = require('express')
, app = express()
, http = require('http')
, server = http.createServer(app);

app.use(express.static(__dirname + '/dist'));

// Configuration 
app.get('/', function(req, res, next){
	res.render('index');	
});

// Start server
var port = process.env.PORT || 3000;

server.listen(port);

console.log('Running at Port 3000');