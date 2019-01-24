var fs = require('fs');
var crypto = require('crypto');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var multiparty = require('multiparty');
var Avatar = mongoose.model('Avatar');
// var formidable = require('formidable');
// var sms = require('./ihuyi.js');
// var message = new sms();
// var txt_front = "您的验证码是：";
// var txt_back = "。请不要把验证码泄露给其他人。";

function hashPW(password) {
	return crypto.createHash('sha256').update(password)
				.digest('base64').toString();
}

exports.login = function(req, res){
	var username = req.body.username;
	var password = hashPW(req.body.password);

	var data = {
			"username": username
		};

	if(req.session.user) {
		// console.log(req);
		console.log(username, req.body.password);

		// data = JSON.stringify(data);
		// req.session.destroy(function(){
		// 	console.log(username + " logout");
		// 	res.status(200).json(username + " logout");
		// 	res.end();
		// });
		User.findOne({username: username})
			.exec(function(err, user) {
				if(user) {
					if(user.password_hash === password) {
						req.session.user = user;
						res.cookie('LLmusic', {"username": username}, {maxAge: 60*60*3000, httpOnly: false});
						req.session.msg = 'success';
						// req.session.save();
						console.log(username + " login");
						console.log(data);
						res.status(200).json(data);
						res.end();
					} else {
						// req.session.user = null;
						// req.session.msg = 'password error';
						console.log("password error");
						res.status(200).json("password error");
						res.end();
					}
				} else {
					// req.session.user = null;
					// req.session.msg = 'no user';
					console.log('no user');
					res.status(200).json("no user");
					res.end();
				}
			});

		// console.log('already login');
		// res.status(200).json("already login");
		// res.end();
	} else {
		// console.log(req);
		// username = req.body.username;
		// password = hashPW(req.body.password);
		// var username = req.query.username;
		// var password = hashPW(req.query.password);

		console.log(username, req.body.password);

		// data = {
		// 	"username": username
		// };
		// data = JSON.stringify(data);

		User.findOne({username: username})
			.exec(function(err, user) {
				if(user) {
					if(user.password_hash === password) {
						req.session.user = user;
						res.cookie('LLmusic', {"username": username}, {maxAge: 60*60*3000, httpOnly: false});
						req.session.msg = 'success';
						// req.session.save();
						console.log(username + " login");
						console.log(data);
						res.status(200).json(data);
						res.end();
					} else {
						// req.session.msg = 'password error';
						console.log("password error");
						res.status(200).json("password error");
						res.end();
					}
				} else {
					// req.session.msg = 'no user';
					console.log('no user');
					res.status(200).json("no user");
					res.end();
				}
			});
	}
};

exports.logout = function(req, res) {
	if(req.session.user){
		// console.log(req);
		var username = req.session.user.username;
		req.session.destroy(function(){
			console.log(username + " logout");
			// res.clearCookie(username);
			res.status(200).json(username + " logout");
			res.end();
		});
	} else {
		// console.log(req);
		console.log("no user");
		res.status(200).json("no user");
		res.end();
	}
};

exports.register = function(req, res){
	if(req.session.user) {
		console.log("logined");
		res.status(200).json({msg:"you have already logined"});
		res.end();
	} else {
		// var code = req.session.code;
		// var username = req.body.username;
		var username = req.body.username;

		// console.log(req);
		var password = hashPW(req.body.password);
		//console.log(req);
		//console.log(code + " " + req.body.check_word);

		var data = {
			username: username
		};
		// data = JSON.stringify(data);
		//console.log(data);
		//res.sendStatus(404);
		//res.send(data);

		User.findOne({username: username})
			.exec(function(err, user){
				if(user) {
					console.log('username is already exist');
					// req.session.msg = 'username is already exist';
					res.status(200).json("username is already exist");
					res.end();
					//return;
				} else {
					var new_user = new User({username: username, password_hash: password});
					new_user.save(function(err) {
						if(err) {
							console.log(err);
							// req.session.msg = 'error';
							res.status(200).json('error');
							res.end();
						} else {
							//console.log("you");
							req.session.user = new_user;
							res.cookie('LLmusic', {"username": username}, {maxAge: 60*60*3000, httpOnly: false});
							req.session.msg = 'success';
							console.log("new user", username);
							res.status(200).json(data);
							res.end();
						}
					});
				}
		});
	}

	/*if(req.body.username == '18819253726') {
		req.session.msg = 'success';
		res.status(200).json(data);
	} else {
		res.status(404);
	}*/
	//res.end();
};

exports.check_tel = function(req, res){
	var code = Math.round(Math.random()*8999+1000);
	var telnumber = req.body.username;
	var txt = txt_front + code + txt_back;
	console.log(telnumber + " " + code);
	//console.log(txt);

	User.findOne({username: telnumber})
		.exec(function(err, user){
			if(user) {
				req.session.msg = 'telnumber is already exist';
				res.status(404);
				res.end();
				//return;
			} else {
				//req.session.msg = 'the telnumber is free';
				message.send(telnumber, txt, function(err, status){
					if(err){
						console.log(err);
					} else {
						console.log(status);
					}
				});
				req.session.code = code.toString();
				res.status(200);
				res.end();
				//return;
			}			
	});
};

exports.upload = function(req, res) { //请使用$.ajax 不要使用$.post, 需要用到contentType,processData字段
	if(req.session.user) {
	//console.log('yes');
	var form = new multiparty.Form({uploadDir: './static/files/images'});
	//console.log(form.uploadDir);
	form.parse(req, function(err, fields, files) {
	    var filesTmp = JSON.stringify(files);
	
	    if(err){
	      console.log('parse error: ' + err);
	      res.status(404);
	      res.end();
	    } else {
	      	testJson = eval("(" + filesTmp+ ")");
	      	//console.log(testJson);
	    	console.log("new url= " + testJson.file[0].path);
	    	//console.log(req.session.user);
	    	avatar_url = testJson.file[0].path;
	    	username = req.session.user.username;
	    	avatar_now = req.session.user.avatar_url;
	  		console.log("old url= " + avatar_now);

	    	if(avatar_now !== "") {
	    		fs.unlink(avatar_now, function(err) {
	    			if(err) {
	    				console.log(err);
	    			}
	    		});
	    	}

		    User.findOne({username: username})
				.exec(function(err, user){
					if(user) {
						user.set('avatar_url', avatar_url);
						user.save(function(err) {
							if(err) {
								res.status(404);
								res.end();
							} else {
								req.session.user = user;
								res.status(200).json({imgSrc:avatar_url});
								res.end();
							}
						});
						//return;
					} else {
						console.log(err);
						res.status(404);
						res.end();
						//return;
					}			
			});
	    }
	});
	} else {
		res.status(404).json({msg:"please login first"});
		res.end();
	}
};

exports.get_user_avatar = function(req, res) {
	if(req.session.user) {
		var username = req.body.username;

		User.findOne({username: username})
			.exec(function(err, user){
				if(user) {
					var avatar_num = user.avatar_number;
					Avatar.findOne({avatar_num: avatar_num})
						.exec(function (err1, avatar) {
							if(avatar) {
								var data = {
									picture: avatar.avatar_value,
								};
								res.status(200).json(data);
								res.end();
							} else {
								res.status(200).json(err1);
							}
						})
				} else {
					res.status(200).json("no user");
					res.end();
				}
		});
	} else {
		res.status(200).json("please login first");
		res.end();
	}
};

exports.get_all_avatar = function(req, res) {
	if(req.session.user) {
		var list = [0, 1, 2, 3, 4, 5, 6];
		var pictures = {pictures: []};
		(function iterator(i) {
			Avatar.findOne({avatar_num: list[i]})
				.exec(function (err, avatar) {
					if (err) {
						res.status(200).json(err);
						res.end();
					} else {
						var name = {
							avatar_num: avatar.avatar_num,
							avatar_picture: avatar.avatar_value,
						};
						pictures.pictures.push(name);

						if (i + 1 === list.length) {
							res.status(200).json(pictures);
							res.end();
						} else {
							iterator(i + 1);
						}
					}
				});
		})(0);
	} else {
		res.status(200).json("please login first");
		res.end();
	}
};

exports.change_avatar = function(req, res) {
	if(req.session.user) {
		var username = req.body.username;
		var number = req.body.number;
		if (number === 'undefined') {
			number = 0;
		}

		User.findOne({username: username})
			.exec(function(err, user){
				if(user) {
					user.set('avatar_number', number);
					user.save(function (err) {
						if(err) {
							res.status(200).json(err);
							res.end();
						} else {
							res.status(200).json("ok");
							res.end();
						}
					})
				} else {
					res.status(200).json("no user");
					res.end();
				}
		});
	} else {
		res.status(200).json("please login first");
		res.end();
	}
};

exports.add_avatar = function(req, res) {
	var number = req.body.avatar_number;
	var picture = req.body.avatar_picture;
	// console.log(number, picture);

	var avatar = new Avatar({avatar_num: number, avatar_value: picture});
	avatar.save(function (err) {
		if(err) {
			res.status(200).json(err);
			res.end();
		} else {
			res.status(200).json("ok");
			res.end();
		}
	})
};

exports.preview_pic = function(req, res) {
	if(req.session.user) {
	//console.log('yes');
	var form = new multiparty.Form({uploadDir: './static/files/preview_pic'});
	//console.log(form.uploadDir);
	form.parse(req, function(err, fields, files) {
	    var filesTmp = JSON.stringify(files);
	
	    if(err){
	      console.log('parse error: ' + err);
	      res.status(404);
	      res.end();
	    } else {
	      	testJson = eval("(" + filesTmp+ ")");
	      	//console.log(testJson);
	    	console.log(testJson.file[0].path);
	    	//console.log(req.session.user);
	     	res.status(200).json({imgSrc:testJson.file[0].path});
	     	res.end();
	    }
	});
	} else {
		res.status(404).json({msg:"please login first"});
		res.end();
	}
};
