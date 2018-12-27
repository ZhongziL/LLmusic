exports.getMusicLists = function(req, res) {
    if(req.session.user){
		var username = req.query.username;

        User.findOne({username: username})
            .exec(function(err, user) {
                if(user) {
                    var musicLists = user.music_lists;
                    var name_list = {name_list: []};

                    (function iterator(i) {
                        MusicList.findOne({_id: musicLists[i]})
                            .exec(function (err, musiclist) {
                                if(err) {
                                    res.status(404);
                                    res.end();
                                } else {
                                    var name = {name: musiclist.list_name,
                                                id: musiclist._id};
                                    name_list.name_list.push(name);

                                    if (i + 1 === musicLists.length) {
                                        res.status(200).json(name_list);
                                        res.end();
                                    } else {
                                        iterator(i + 1);
                                    }
                                }
                            });
                    })(0);
                    // for (var mlist in musicLists) {
                    //     MusicList.findOne({_id: musicLists[mlist]})
                    //         .exec(function (err, musiclist) {
                    //             if(err) {
                    //                 res.status(404);
                    //                 res.end();
                    //             } else {
                    //                 var name = {name: musiclist.list_name,
                    //                             id: musiclist._id};
                    //                 name_list.name_list.push(name);
                    //             }
                    //         });
                    // }

                    // res.status(200).json(name_list);
                    // res.end();
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
		var id = req.query.musicList_id;

        MusicList.findOne({_id: id})
            .exec(function(err, musicList) {
                if(musicList) {
                    var musics = musicList.songList;
                    var name_list = {name_list: []};

                    (function iterator(i) {
                        Music.findOne({_id: musics[i]})
                            .exec(function (err, song) {
                                if(err) {
                                    res.status(404);
                                    res.end();
                                } else {
                                    var name = {song_name: song.song_name,
                                                singer_name: song.singer_name,
                                                id: song._id};
                                    name_list.name_list.push(name);

                                    if (i + 1 === musics.length) {
                                        res.status(200).json(name_list);
                                        res.end();
                                    } else {
                                        iterator(i + 1);
                                    }
                                }
                            });
                    })(0);
                    // for (var music in musics) {
                    //     Music.findOne({_id: musics[music]})
                    //         .exec(function (err, song) {
                    //             if(err) {
                    //                 res.status(404);
                    //                 res.end();
                    //             } else {
                    //                 var name = {song_name: song.song_name,
                    //                             singer_name: song.singer_name,
                    //                             id: song._id};
                    //                 name_list.name_list.push(name);
                    //             }
                    //         });
                    // }
                    //
                    // res.status(200).json(name_list);
                    // res.end();
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
    var id = req.query.music_id;

    Music.findOne({_id : id}).exec(function (err, music) {
       if(music) {
           comments_id = music.comments;
           var comments = {comments: []};

           (function iterator(i) {
                Comment.findOne({_id: comments_id[i]})
                   .exec(function (err, comment) {
                       if(err) {
                           res.status(404);
                           res.end();
                       } else {
                           var c = {username: comment.username,
                                    content: comment.content,
                                    replies_num: comment.replies.length,
                                    likeUsers_num: comment.likeUsers.length};

                           comments.comments.push(c);

                           if (i + 1 === musics.length) {
                               var data = {
                                   song_name: music.song_name,
                                   singer_name: music.singer_name,
                                   song_words: music.song_words,
                                   song_url: music.song_url,
                                   comments: comments
                               };

                                res.status(200).json(data);
                                res.end();
                            } else {
                                iterator(i + 1);
                            }
                       }
                   });
            })(0);

           // for (cid in comments_id) {
           //     Comment.findOne({_id: comments_id[cid]})
           //         .exec(function (err, comment) {
           //             if(err) {
           //                 res.status(404);
           //             } else {
           //                 var c = {username: comment.username,
           //                          content: comment.content,
           //                          replies_num: comment.replies.length,
           //                          likeUsers_num: comment.likeUsers.length};
           //
           //                 comments.comments.push(c);
           //             }
           //         })
           // }

           // var data = {
           //     song_name: music.song_name,
           //     singer_name: music.singer_name,
           //     song_words: music.song_words,
           //     song_url: music.song_url,
           //     comments: comments
           // };
           //
           // res.status(200).json(data);
           // res.end();
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
        var username = req.body.username;

		var musicList = new MusicList({list_name: list_name});
        musicList.set('description', description);
        musicList.save(function(err) {
            if(err) {
                console.log(err);
                //req.session.error = 'error';
                res.status(404);
                res.end();
            } else {
                User.findOne({username: username}).exec(function (err, user) {
                    if(user) {
                        var lists = user.music_lists;
                        lists.push(musicList._id);
                        user.set('music_lists', lists);
                        user.save(function (err) {
                           if(err) {
                               res.status(404);
                               res.end();
                           } else {
                               res.status(200);
                               res.end();
                           }
                        });
                    } else {
                        res.status(404);
                        res.end();
                    }
                });
            }
        });
    } else {
		res.status(404);
		res.end();
	}
};

exports.addMusicToList = function (req, res) {
    if(req.session.user) {
        var list_id = req.body.list_id;
        var song_url = req.body.song_url;
        var singer = req.body.singer;
        var song_name = req.body.song_name;

        // var song_words = req.body.song_word;

        Music.findOne({song_url: song_url}).exec(function (err, music) {
            if (music) {
                res.status(404);
                res.end();
            } else {
                var song = new Music({'song_url' : song_url});
                song.set('singer_name', singer);
                song.set('song_name', song_name);
                // song.set('song_words', song_words);
                song.save(function(err) {
                    if(err) {
                        res.status(404);
                        res.end();
                    } else {
                        MusicList.findOne({_id : list_id}).exec(function (err, musiclist) {
                            if (musiclist) {
                                var songL = musiclist.songList;
                                songL.push(song._id);
                                musiclist.set('songList', songL);
                                musiclist.save(function(err) {
                                    if (err) {
                                        res.status(404);
                                        res.end();
                                    } else {
                                        res.status(200);
                                        res.end();
                                    }
                                });
                            } else {
                                res.status(404);
                                res.end();
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.status(404);
        res.end();
    }
};


exports.removeList = function (req, res) {
    if(req.session.user){
		var list_id = req.body.list_id;
        var username = req.body.username;

        User.findOne({username: username}).exec(function (err, user) {
            if(user) {
                var lists = user.music_lists;

                lists.remove(list_id);

                user.set('music_lists', lists);
                user.save(function (err) {
                   if(err) {
                       res.status(404);
                       res.end();
                   } else {
                       res.status(200);
                       res.end();
                   }
                });
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


exports.removeSong = function (req, res) {
    if(req.session.user) {
        var list_id = req.body.list_id;
        var song_id = req.body.song_id;

        // var song_words = req.body.song_word;

        MusicList.findOne({_id : list_id}).exec(function (err, musiclist) {
            if (musiclist) {
                var songL = musiclist.songList;
                songL.remove(song_id);
                musiclist.set('songList', songL);
                musiclist.save(function(err) {
                    if (err) {
                        res.status(404);
                        res.end();
                    } else {
                        res.status(200);
                        res.end();
                    }
                });
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

exports.changeListName = function (req, res) {
    if(req.session.user) {
        var list_id = req.body.list_id;
        var list_name = req.body.list_name;

        MusicList.findOne({_id : list_id}).exec(function (err, musiclist) {
            if (musiclist) {
                musiclist.set('list_name', list_name);
                musiclist.save(function(err) {
                    if (err) {
                        res.status(404);
                        res.end();
                    } else {
                        res.status(200);
                        res.end();
                    }
                });
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

exports.collectList = function (req, res) {
    if(req.session.user){
        var list_id = req.body.list_id;

        var username = req.body.username;

        User.findOne({username: username}).exec(function (err, user) {
            if(user) {
                var lists = user.collect_lists;
                lists.push(list_id);
                user.set('collect_lists', lists);
                user.save(function (err) {
                   if(err) {
                       res.status(404);
                       res.end();
                   } else {
                       res.status(200);
                       res.end();
                   }
                });
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