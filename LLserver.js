var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var connect = require('connect');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

require('./back_end/models/user_model.js');

var conn = mongoose.connect('mongodb://localhost:27017/test');
//console.log(conn.connections[0].collections);

var app = express();

app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use(bodyParser());
//app.use(bodyParser.text());  //req.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('ZhongziL')); 	//req.cookie
// app.set('trust proxy', 1);
app.use(session({
	resave: false,
	secret: 'ZhongziL',
	cookies: {maxAge: 60*60*1000, httpOnly: false}, 	//1h
	store: new mongoStore({
		url: 'mongodb://localhost:27017/test',
		//db: mongoose.connection.db, //connect error
		collection: 'sessions'
	})
}));					//req.session

app.set('views', __dirname + '/front_end/pages');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

require('./back_end/routers/router')(app);
app.listen(5000);

console.log("the web-server is running on 'localhost:5000'");
