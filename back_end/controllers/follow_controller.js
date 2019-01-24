var mongoose = require("mongoose");
var Music = mongoose.model("Music");
var User = mongoose.model("User");
var MusicList = mongoose.model("MusicList");

exports.loveSong = function(req, res) {
    if(req.session.user){
        var song_hash = req.body.file_Hash;
        var song_url = req.body.song_url;
        var singer = req.body.singer;
        var song_name = req.body.song_name;
		var username = req.body.username;

		var song = new Music({'song_hash' : song_hash});
		song.set('song_url', song_url);
        song.set('singer_name', singer);
        song.set('song_name', song_name);
        // song.set('song_words', song_words);
        song.save(function(err) {
            User.findOne({username: username})
                .exec(function(err, user) {
                    if(user) {
                        var favourite_music = user.favourite_music;
                        lists.push(song._id);
                        user.set('favourite_music', favourite_music);
                        user.save(function (err) {
                           if(err) {
                               res.status(200).json(err);
                               res.end();
                           } else {
                               res.status(200).json("ok");
                               res.end();
                           }
                        });
                    } else {
                        req.session.msg = 'no user';
                        res.status(200).json("no user");
                        res.end();
                    }
                });
            // if(err) {
            //     res.status(200).json(err);
            //     res.end();
            // }
        });
    } else {
		res.status(200).json("no login");
		res.end();
	}
};

exports.searchUser = function (req, res) {
    if(req.session.user) {
        var username = req.body.username;

        User.findOne({username: username})
            .exec(function (err, user) {
                if (user) {
                    var data = {
                        username : username,
                        musiclists: [],
                    };
                    lists = user.music_lists;
                    if (lists.length === 0) {
                        res.status(200).json(data);
                        res.end();
                    } else {
                        (function iterator(i) {
                            // console.log(i);
                            MusicList.findOne({_id: lists[i]})
                                .exec(function (err, musiclist) {
                                    if (err) {
                                        res.status(200).json(err);
                                        res.end();
                                    } else {
                                        var name = {
                                            name: musiclist.list_name,
                                            id: musiclist._id,
                                            description: musiclist.description
                                        };
                                        data.musiclists.push(name);

                                        if (i + 1 === lists.length) {
                                            res.status(200).json(data);
                                            res.end();
                                        } else {
                                            iterator(i + 1);
                                        }
                                    }
                                });
                        })(0);
                    }
                } else {
                    res.status(200).json("no user");
                    res.end();
                }
            })
    } else {
        res.status(200).json("no login");
		res.end();
    }
};

exports.focusUser = function(req, res) {
    if (req.session.user) {
        var oriUsername = req.body.oriUsername;
        var targetUsername = req.body.targetUsername;

        User.findOne({username: oriUsername})
            .exec(function (err, user) {
                if (err) {
                    res.status(200).json("no oriUsername");
                    res.end();
                } else {
                    var lists = user.focus_users;
                    lists.remove(targetUsername);
                    lists.push(targetUsername);
                    user.set('focus_users', lists);
                    user.save(function (err) {});

                    User.findOne({username: targetUsername})
                        .exec(function (err1, user1) {
                            if (err1) {
                                console.log(lists);
                                lists.remove(targetUsername);
                                user.save(function (err) {
                                    res.status(200).json("no targetUsername");
                                    res.end();
                                });
                            } else {
                                console.log(lists);
                                var fanlists = user1.fans;
                                fanlists.remove(oriUsername);
                                fanlists.push(oriUsername);
                                console.log(fanlists);
                                user1.set('fans', fanlists);
                                user1.save(function (err) {
                                    res.status(200).json("ok");
                                    res.end();
                                });
                            }
                        })
                }
            })
    } else {
        res.status(200).json("no login");
        res.end();
    }
};

exports.getUserFocus = function(req, res) {
    if (req.session.user) {
        var username = req.body.username;

        User.findOne({username: username})
            .exec(function (err, user) {
                if (err) {
                    res.status(200).json("no user");
                    res.end();
                } else {
                    var data = {
                        focus_list : user.focus_users,
                    };
                    res.status(200).json(data);
                    res.end();
                }
            })
    } else {
        res.status(200).json("no login");
        res.end();
    }
};

exports.getUserFans = function(req, res) {
    if (req.session.user) {
        var username = req.body.username;

        User.findOne({username: username})
            .exec(function (err, user) {
                if (err) {
                    res.status(200).json("no user");
                    res.end();
                } else {
                    var data = {
                        fans_list : user.fans,
                    };
                    res.status(200).json(data);
                    res.end();
                }
            })
    } else {
        res.status(200).json("no login");
        res.end();
    }
};

exports.IsFocused = function(req, res) {
    if (req.session.user) {
        var oriUsername = req.body.oriUsername;
        var targetUsername = req.body.targetUsername;

        User.findOne({username: oriUsername})
            .exec(function (err, user) {
                if (err) {
                    res.status(200).json("no user");
                    res.end();
                } else {
                    var focus_lists = user.focus_users;
                    var bool = focus_lists.find(targetUsername);
                    res.status(200).json(bool);
                    res.end();
                }
            })
    } else {
        res.status(200).json("no login");
        res.end();
    }
};

exports.unFocus = function(req, res) {
    if (req.session.user) {
        var oriUsername = req.body.oriUsername;
        var targetUsername = req.body.targetUsername;

        User.findOne({username: oriUsername})
            .exec(function (err, user) {
                if (err) {
                    res.status(200).json("no oriUsername");
                    res.end();
                } else {
                    var lists = user.focus_users;
                    lists.remove(targetUsername);
                    // lists.push(targetUsername);

                    User.findOne({username: targetUsername})
                        .exec(function (err1, user1) {
                            if (err1) {
                                // lists.remove(targetUsername);
                                res.status(200).json("no targetUsername");
                                res.end();
                            } else {
                                var fanlists = user1.fans;
                                fanlists.remove(oriUsername);
                                // fanlists.push(oriUsername);

                                res.status(200).json("ok");
                                res.end();
                            }
                        })
                }
            })
    } else {
        res.status(200).json("no login");
        res.end();
    }
};