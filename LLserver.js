var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var connect = require('connect');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

require('./models/user_model.js');
require('./models/film_model.js');
require('./models/ticket_model.js');
require('./models/comment_model.js');
require('./models/theater_model.js');

var conn = mongoose.connect('mongodb://localhost:27017/mydatabase');
//console.log(conn.connections[0].collections);

var app = express();
app.use(bodyParser());
//app.use(bodyParser.text());  //req.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('ZhongziL')); 	//req.cookie
app.use(session({
	secret: 'ZhongziL',
	cookies: {maxAge: 60*60*1000}, 	//1h
	store: new mongoStore({
		url: 'mongodb://localhost:27017/mydatabase',
		//db: mongoose.connection.db, //connect error
		collection: 'sessions'
	})
}));					//req.session

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

require('./routers/auth_router')(app);
app.listen(5000);

console.log("the web-server is running on 'localhost:5000'");
