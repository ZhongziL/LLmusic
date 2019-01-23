var express = require('express');

module.exports = function(app) {
	var user = require('../controllers/user_controller.js');
	var music = require('../controllers/music_controller.js');
	var song = require('../controllers/follow_controller.js');
	var search = require('../controllers/search_controller.js');
	// var film = require('../controllers/film_controller.js');
	// var comment = require('../controllers/comment_controller.js');
	// var sms = require('../controllers/ihuyi.js');
	// var send_message = new sms();

	// app.use('/static', express.static('./back_end/static'));
	
	// app.get('/', function(req, res) {
	// 	console.log('request to route /');
	// 	res.render('home/home');
	// 	//res.send('Hello World');
	// });
	//
	// app.post('/', function(req,res) {
	// 	console.log('post to /');
	// 	res.render('home/home');
	// });
	//
	// app.get('/movielist', function(req, res) {
	// 	console.log('get movielist');
	// 	res.render('movielist/movielist');
	// });
	//
	// app.get('/detail', function(req, res) {
	// 	var film_name = req.query.film_name;
	// 	//console.log('request to route /detail');
	// 	console.log(film_name);
	// 	res.render('detail/detail');
	// });

	// app.get('/login', function(req, res) {
	// 	console.log('request to login page');
	// 	if(req.session.user) {
	// 		res.redirect('/');
	// 	}
	// 	else {
	// 		//res.sendfile('./views/auth/login.html');
	// 		res.render('auth/login');
	// 	}
	// });

	app.post('/login', user.login);

	// app.get('/register', function(req, res){
	// 	console.log('request to register page');
	// 	if(req.session.user) {
	// 		res.redirect('/');
	// 	}
	// 	else {
	// 		res.render('auth/register');
	// 	}
	// });

	app.post('/register', user.register);

	// app.post('/check_tel', user.check_tel);

	app.get('/logout', user.logout);

	app.get('/getMusicLists', music.getMusicLists);

	app.get('/getMusicInList', music.getMusicsInList);

	app.get('/getSong', music.getSong);

	app.post('/addMusicList', music.addMusicList);

	app.post('/addMusicToList', music.addMusicToList);

	app.post('/removeList', music.removeList);

	app.post('/removeUserList', music.removeUserList);

	app.post('/removeSong', music.removeSong);

	app.post('/changeListName', music.changeListName);

	app.post('/collectList', music.collectList);

	app.post('/loveSong', song.loveSong);

	app.post('/searchSong', search.search_list);

	app.post('/getFavouriteSongList', music.getFavouriteSongList);

	app.post('/addMusic', music.addMusic);

	// app.post('/addFavouriteMusic', music.addFavouriteMusic);

	//
	// app.post('/upload', user.upload);
	// //app.post('/preview_pic', user.preview_pic);
	//
	// app.get('/get_avatar', user.get_avatar);
	//
	// //app.get('/add', film.addfilm);
	// app.get('/getFilmList', film.getFilmList);
	// app.get('/getList', film.getList);
	// app.post('/changeFilmScore', film.changeFilmScore);
	// //app.get('/getFilmLink', film.getFilmLink);
	// app.get('/getFilmProfile', film.getFilmProfile);
	//
	// app.get('/getFilmDetail', film.getFilmDetail);
	//
	// app.get('/get_comment', comment.get_comment);
	// app.post('/add_comment', comment.add_comment);
};
