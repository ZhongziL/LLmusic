var mongoose = require("mongoose");
var User = mongoose.model("User");
var MusicList = mongoose.model("MusicList");
var Music = mongoose.model("Music");
var Comment = mongoose.model("Comment");
var ObjectID = require('mongodb').ObjectID;

exports.getMusicLists = function(req, res) {
    if(req.session.user){
		var username = req.query.username;

		console.log(username);

        User.findOne({username: username})
            .exec(function(err, user) {
                if(user) {
                    console.log("ok");
                    var musicLists = user.music_lists;
                    var name_list = {name_list: []};

                    console.log(musicLists.length);
                    if (musicLists.length === 0) {
                        res.status(200).json(name_list);
                        res.end();
                    } else {

                        (function iterator(i) {
                            console.log(i);
                            MusicList.findOne({_id: musicLists[i]})
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
                    }
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
                    console.log(err);
                    // req.session.msg = 'no user';
                    res.status(200).json("no user");
                    res.end();
                }
            });
    } else {
		res.status(200).json("no login");
		res.end();
	}
};

exports.getMusicsInList = function(req, res) {
    if(req.session.user){
		var id = ObjectID(req.query.musicList_id);

        MusicList.findOne({_id: id})
            .exec(function(err, musicList) {
                if(musicList) {
                    var musics = musicList.songList;
                    var name_list = {name_list: []};

                    if (musics.length === 0) {
                        res.status(200).json(name_list);
                        res.end();
                    } else {

                        (function iterator(i) {
                            Music.findOne({_id: musics[i]})
                                .exec(function (err, song) {
                                    if (err) {
                                        res.status(200).json(err);
                                        res.end();
                                    } else {
                                        var name = {
                                            song_hash: song.song_hash,
                                            song_name: song.song_name,
                                            singer_name: song.singer_name,
                                            song_url : song.song_url,
                                            song_img : song.song_img,
                                            song_words: song.song_words,
                                            id: song._id
                                        };
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
                    }
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
                    // req.session.msg = 'no musicList';
                    res.status(200).json("no musicList");
                    res.end();
                }
            });
    } else {
		res.status(200).json("no login");
		res.end();
	}
};

exports.getSong = function (req, res) {
    var id = ObjectID(req.query.music_id);

    Music.findOne({_id : id}).exec(function (err, music) {
       if(music) {
           comments_id = music.comments;
           var comments = {comments: []};

           if (comments_id.length === 0) {
               var datanull = {
                   song_hash: music.song_hash,
                   song_name: music.song_name,
                   singer_name: music.singer_name,
                   song_words: music.song_words,
                   song_url: music.song_url,
                   song_img: music.song_img,
                   comments: comments
               };
               res.status(200).json(datanull);
               res.end()
           } else {

               (function iterator(i) {
                   Comment.findOne({_id: comments_id[i]})
                       .exec(function (err, comment) {
                           if (err) {
                               res.status(200).json(err);
                               res.end();
                           } else {
                               var c = {
                                   username: comment.username,
                                   content: comment.content,
                                   replies_num: comment.replies.length,
                                   likeUsers_num: comment.likeUsers.length
                               };

                               comments.comments.push(c);

                               if (i + 1 === musics.length) {
                                   var data = {
                                       song_hash: music.song_hash,
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

           }

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
           res.status(200).json("no music");
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
                res.status(200).json(err);
                res.end();
            } else {
                User.findOne({username: username}).exec(function (err, user) {
                    if(user) {
                        var lists = user.music_lists;
                        lists.push(musicList._id);
                        user.set('music_lists', lists);
                        user.save(function (err) {
                           if(err) {
                               res.status(200).json(err);
                               res.end();
                           } else {
                               var data = {"list_id": musicList._id};
                               res.status(200).json(data);
                               res.end();
                           }
                        });
                    } else {
                        res.status(200).json("no user");
                        res.end();
                    }
                });
            }
        });
    } else {
		res.status(200).json("no login");
		res.end();
	}
};

exports.addMusic = function (req, res) {
    var song_fileHash = req.body.fileHash;
    var song_url = req.body.song_url;
    var singer = req.body.singer;
    var song_name = req.body.song_name;
    var song_lyrics = req.body.song_words;
    var song_img = req.body.song_img;
    var list_id = ObjectID(req.body.list_id);
    // console.log(list_id);

    // var song = new Music({'song_url' : song_url});
    //     song.set('singer_name', singer);
    //     song.set('song_name', song_name);
    //     song.set('song_words', song_lyrics);
    //     song.set('song_img', song_img);
    //
    //     song.save(function(err) {
    //         if (err) {
    //             res.status(200).json(err);
    //             res.end();
    //         } else {
    //             res.status(200).json("ok");
    //             res.end();
    //         }
    //     });

    Music.findOne({song_hash: song_fileHash}).exec(function (err, music) {
        if (music) {
            MusicList.findOne({_id : list_id}).exec(function (err, musiclist) {
                if (musiclist) {
                    var songL = musiclist.songList;
                    songL.remove(music._id);
                    songL.push(music._id);
                    musiclist.set('songList', songL);
                    musiclist.save(function(err) {
                        if (err) {
                            res.status(200).json("already in it");
                            res.end();
                        } else {
                            console.log("music in it");
                            res.status(200).json("ok");
                            res.end();
                        }
                    });
                } else {
                    res.status(200).json("no musiclist");
                    res.end();
                }
            });
        } else {
            var song = new Music({'song_hash' : song_fileHash});
            song.set('song_url', song_url);
            song.set('singer_name', singer);
            song.set('song_name', song_name);
            song.set('song_words', song_lyrics);
            song.set('song_img', song_img);

            song.save(function(err) {
                MusicList.findOne({_id : list_id}).exec(function (err, musiclist) {
                    if (musiclist) {
                        var songL = musiclist.songList;
                        songL.remove(song._id);
                        songL.push(song._id);
                        musiclist.set('songList', songL);
                        musiclist.save(function(err) {
                            if (err) {
                                res.status(200).json(err);
                                res.end();
                            } else {
                                console.log("new music");
                                res.status(200).json("ok");
                                res.end();
                            }
                        });
                    } else {
                        res.status(200).json("no musiclist");
                        res.end();
                    }
                });
            });
        }
    });
};

exports.addMusicToList = function (req, res) {
    if(req.session.user) {
        var list_id = ObjectID(req.body.list_id);
        var song_hash = req.body.song_hash;
        var song_url = req.body.mp3;
        var singer = req.body.singer;
        var song_name = req.body.song_name;
        var song_lyrics = req.body.song_word;
        var song_img = req.body.img;

        // var song_words = req.body.song_word;

        Music.findOne({song_hash: song_hash}).exec(function (err, music) {
            if (music) {
                MusicList.findOne({_id : list_id}).exec(function (err, musiclist) {
                    if (musiclist) {
                        var songL = musiclist.songList;
                        songL.remove(music._id);
                        songL.push(music._id);
                        musiclist.set('songList', songL);
                        musiclist.save(function(err) {
                            if (err) {
                                res.status(200).json(err);
                                res.end();
                            } else {
                                res.status(200).json("ok");
                                res.end();
                            }
                        });
                    } else {
                        res.status(200).json("no musiclist");
                        res.end();
                    }
                });
            } else {
                var song = new Music({'song_hash' : song_hash});
                song.set('song_url', song_url);
                song.set('singer_name', singer);
                song.set('song_name', song_name);
                song.set('song_words', song_lyrics);
                song.set('song_img', song_img);

                song.save(function(err) {
                    MusicList.findOne({_id : list_id}).exec(function (err, musiclist) {
                        if (musiclist) {
                            var songL = musiclist.songList;
                            songL.remove(song._id);
                            songL.push(song._id);
                            musiclist.set('songList', songL);
                            musiclist.save(function(err) {
                                if (err) {
                                    res.status(200).json(err);
                                    res.end();
                                } else {
                                    res.status(200).json("ok");
                                    res.end();
                                }
                            });
                        } else {
                            res.status(200).json("no musiclist");
                            res.end();
                        }
                    });
                    // if(err) {
                    //     res.status(200).json(err);
                    //     res.end();
                    // } else {
                    //     MusicList.findOne({_id : list_id}).exec(function (err, musiclist) {
                    //         if (musiclist) {
                    //             var songL = musiclist.songList;
                    //             songL.push(song._id);
                    //             musiclist.set('songList', songL);
                    //             musiclist.save(function(err) {
                    //                 if (err) {
                    //                     res.status(200).json(err);
                    //                     res.end();
                    //                 } else {
                    //                     res.status(200).json("ok");
                    //                     res.end();
                    //                 }
                    //             });
                    //         } else {
                    //             res.status(200).json("no musiclist");
                    //             res.end();
                    //         }
                    //     });
                    // }
                });
            }
        });
    } else {
        res.status(200).json("no login");
        res.end();
    }
};

exports.removeUserList = function(req, res) {
    var list_id = ObjectID(req.body.list_id);
    var username = req.body.username;

    User.findOne({username: username}).exec(function (err, user) {
        if(user) {
            var lists = user.music_lists;

            lists.remove(list_id);

            user.set('music_lists', lists);
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
            res.status(200).json("no user");
            res.end();
        }
    });
};

exports.removeList = function (req, res) {
    if(req.session.user){
		var list_id = ObjectID(req.body.list_id);
        var username = req.body.username;

        User.findOne({username: username}).exec(function (err, user) {
            if(user) {
                var lists = user.music_lists;

                lists.remove(list_id);

                user.set('music_lists', lists);
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
                res.status(200).json("no user");
                res.end();
            }
        });
    } else {
		res.status(200).json("no login");
		res.end();
	}
};

exports.removeCollectList = function (req, res) {
    if(req.session.user){
		var list_id = ObjectID(req.body.list_id);
        var username = req.body.username;

        User.findOne({username: username}).exec(function (err, user) {
            if(user) {
                var lists = user.collect_lists;

                lists.remove(list_id);

                user.set('collect_lists', lists);
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
                res.status(200).json("no user");
                res.end();
            }
        });
    } else {
		res.status(200).json("no login");
		res.end();
	}
};


exports.removeSong = function (req, res) {
    if(req.session.user) {
        var list_id = ObjectID(req.body.list_id);
        var song_id = ObjectID(req.body.song_id);

        // var song_words = req.body.song_word;

        MusicList.findOne({_id : list_id}).exec(function (err, musiclist) {
            if (musiclist) {
                var songL = musiclist.songList;
                songL.remove(song_id);
                musiclist.set('songList', songL);
                musiclist.save(function(err) {
                    if (err) {
                        res.status(200).json(err);
                        res.end();
                    } else {
                        res.status(200).json("ok");
                        res.end();
                    }
                });
            } else {
                res.status(200).json("no musiclist");
                res.end();
            }
        });
    } else {
        res.status(200).json("no login");
        res.end();
    }
};

exports.removeFavouriteSong = function (req, res) {
    if(req.session.user) {
        var username = req.body.username;
        var song_id = ObjectID(req.body.song_id);

        // var song_words = req.body.song_word;

        User.findOne({username : username}).exec(function (err, user) {
            if (user) {
                var songL = user.favourite_music;
                songL.remove(song_id);
                user.set('favourite_music', songL);
                user.save(function(err) {
                    if (err) {
                        res.status(200).json(err);
                        res.end();
                    } else {
                        var data = {
                            msg: "remove",
                            id: song_id,
                            username: username,
                        };
                        res.status(200).json(data);
                        res.end();
                    }
                });
            } else {
                res.status(200).json("no user");
                res.end();
            }
        });
    } else {
        res.status(200).json("no login");
        res.end();
    }
};

exports.removeLiuFavouriteSong = function (req, res) {
    var username = req.body.username;
    // var song_id = ObjectID(req.body.song_id);

    // var song_words = req.body.song_word;

    User.findOne({username : username}).exec(function (err, user) {
        if (user) {
            // var songL = user.favourite_music;
            // songL.remove(song_id);
            user.set('favourite_music', []);
            user.save(function(err) {
                if (err) {
                    res.status(200).json(err);
                    res.end();
                } else {
                    // var data = {
                    //     msg: "remove",
                    //     id: song_id,
                    //     username: username,
                    // };
                    res.status(200).json("ok");
                    res.end();
                }
            });
        } else {
            res.status(200).json("no user");
            res.end();
        }
    });
};

exports.changeListName = function (req, res) {
    if(req.session.user) {
        var list_id = ObjectID(req.body.list_id);
        var list_name = req.body.list_name;
        // var description = req.body.description;

        MusicList.findOne({_id : list_id}).exec(function (err, musiclist) {
            if (musiclist) {
                // if (list_name !== 'undefined') {
                //     musiclist.set('list_name', list_name);
                // }
                // if (description !== 'undefined') {
                //     musiclist.set('description', description);
                // }
                musiclist.set('list_name', list_name);
                musiclist.save(function(err) {
                    if (err) {
                        res.status(200).json(err);
                        res.end();
                    } else {
                        res.status(200).json("ok");
                        res.end();
                    }
                });
            } else {
                res.status(200).json("no musiclist");
                res.end();
            }
        });
    } else {
        res.status(200).json("no login");
        res.end();
    }
};

exports.collectList = function (req, res) {
    if(req.session.user){
        var list_id = ObjectID(req.body.list_id);

        var username = req.body.username;

        User.findOne({username: username}).exec(function (err, user) {
            if(user) {
                var lists = user.collect_lists;
                lists.push(list_id);
                user.set('collect_lists', lists);
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
                res.status(200).json("no user");
                res.end();
            }
        });
    } else {
		res.status(200).json("no login");
		res.end();
	}
};

exports.getCollectLists = function (req, res) {
    if(req.session.user){
		var username = req.query.username;

		console.log(username);

        User.findOne({username: username})
            .exec(function(err, user) {
                if(user) {
                    // console.log("ok");
                    var musicLists = user.collect_lists;
                    var name_list = {name_list: []};

                    console.log(musicLists.length);
                    if (musicLists.length === 0) {
                        res.status(200).json(name_list);
                        res.end();
                    } else {

                        (function iterator(i) {
                            console.log(i);
                            MusicList.findOne({_id: musicLists[i]})
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
                    }
                } else {
                    res.status(200).json("no user");
                    res.end();
                }
            });
    } else {
		res.status(200).json("no login");
		res.end();
	}
};

exports.addFavouriteMusic = function (req, res) {
    if(req.session.user) {
        var song_hash = req.body.song_hash;
        var song_url = req.body.mp3;
        var singer = req.body.singer;
        var song_name = req.body.song_name;
        var username = req.body.username;
        var song_lyrics = req.body.song_word;
        var song_img = req.body.img;

        // var song_words = req.body.song_word;

        Music.findOne({song_hash: song_hash}).exec(function (err, music) {
            if (music) {
                res.status(404);
                res.end();
            } else {
                var song = new Music({'song_hash' : song_hash});
                song.set('song_url', song_url);
                song.set('singer_name', singer);
                song.set('song_name', song_name);
                song.set('song_words', song_lyrics);
                song.set('song_img', song_img);

                // song.set('song_words', song_words);
                song.save(function(err) {
                    if(err) {
                        res.status(404);
                        res.end();
                    } else {
                        User.findOne({username : username}).exec(function (err, user) {
                            if (user) {
                                var songL = user.favourite_music;
                                songL.push(song._id);
                                user.set('favourite_music', songL);
                                user.save(function(err) {
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

exports.getFavouriteSongList = function (req, res) {
    if(req.session.user) {
        var username = req.body.username;

        User.findOne({username: username}).exec(function (err, user) {
            if(user) {
                var musics = user.favourite_music;

                var name_list = {name_list: []};

                if (musics.length === 0) {
                    res.status(200).json(name_list);
                    res.end();
                } else {

                    (function iterator(i) {
                        Music.findOne({_id: musics[i]})
                            .exec(function (err, song) {
                                if (err) {
                                    res.status(200).json(err);
                                    res.end();
                                } else {
                                    var name = {
                                        song_hash: song.song_hash,
                                        song_name: song.song_name,
                                        singer_name: song.singer_name,
                                        song_url : song.song_url,
                                        song_img : song.song_img,
                                        song_words: song.song_words,
                                        id: song._id
                                    };
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
                }

            } else {
                res.status(200).json("no user");
                res.end();
            }
        });
    } else {
		res.status(200).json("no login");
		res.end();
	}
};
