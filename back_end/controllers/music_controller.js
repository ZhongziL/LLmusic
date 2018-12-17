exports.getMusicLists = function(req, res) {
    if(req.session.user){
		var username = req.body.username;

        User.findOne({username: username})
            .exec(function(err, user) {
                if(user) {
                    var musicLists = user.music_lists;
                    var name_list = {name_list: []};
                    for (mlist in musicLists) {
                        MusicList.findOne({_id: musicLists[mlist]})
                            .exec(function (err, musiclist) {
                                if(err) {
                                    res.status(404);
                                    res.end();
                                } else {
                                    var name = {name: musiclist.list_name,
                                                id: musiclist._id};
                                    name_list.name_list.push(name);
                                }
                            });
                    }

                    res.status(200).json(name_list);
                    res.end();
                } else {
                    req.session.msg = 'no user';
                    res.status(404);
                    res.end();
                }
            });
    } else {
		res.status(404);
		res.end();
	}
};

exports.getMusicsInList = function(req, res) {
    if(req.session.user){
		var id = req.body.musicList_id;

        MusicList.findOne({_id: id})
            .exec(function(err, musicList) {
                if(musicList) {
                    var musics = musicList.songList;
                    var name_list = {name_list: []};

                    for (music in musics) {
                        Music.findOne({_id: musics[music]})
                            .exec(function (err, song) {
                                if(err) {
                                    res.status(404);
                                    res.end();
                                } else {
                                    var name = {song_name: song.song_name,
                                                singer_name: song.singer_name,
                                                id: song._id};
                                    name_list.name_list.push(name);
                                }
                            });
                    }

                    res.status(200).json(name_list);
                    res.end();
                } else {
                    req.session.msg = 'no musicList';
                    res.status(404);
                    res.end();
                }
            });
    } else {
		res.status(404);
		res.end();
	}
};

exports.getSong = function (req, res) {
    var id = req.body.music_id;

    Music.findOne({_id : id}).exec(function (err, music) {
       if(music) {
           comments_id = music.comments;

           var comments = {comments: []};
           for (cid in comments_id) {
               Comment.findOne({_id: comments_id[cid]})
                   .exec(function (err, comment) {
                       if(err) {
                           res.status(404);
                       } else {
                           var c = {username: comment.username,
                                    content: comment.content,
                                    replies_num: comment.replies.length,
                                    likeUsers_num: comment.likeUsers.length};

                           comments.comments.push(c);
                       }
                   })
           }

           var data = {
               song_name: music.song_name,
               singer_name: music.singer_name,
               song_words: music.song_words,
               comments: comments
           };

           res.status(200).json(data);
           res.end();
       } else {
           res.status(404);
           res.end();
       }

    });
};

exports.addMusicList = function (req, res) {
    if(req.session.user){
		var list_name = req.body.name;
		var description = req.body.description;

		var musicList = new MusicList({list_name: list_name});
        musicList.set('description', description);
        musicList.save(function(err) {
            if(err) {
                console.log(err);
                //req.session.error = 'error';
                res.status(404);
                res.end();
            }
        });

        var username = req.body.username;

        User.findOne({username: username}).exec(function (err, user) {
            if(user) {
                var lists = user.music_lists;
                lists.push(musicList._id);
                user.set('music_lists', lists);
                user.save(function (err) {
                   if(err) {
                       res.status(404);
                       res.end();
                   }
                });

                res.status(200);
                res.end();
            } else {
                res.status(404);
                res.end();
            }
        });
    } else {
		res.status(404);
		res.end();
	}
};