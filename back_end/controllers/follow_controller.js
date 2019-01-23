var mongoose = require("mongoose");
var Music = mongoose.model("Music");
var User = mongoose.model("User");

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

        // User.findOne({username: username})
        //     .exec(function(err, user) {
        //         if(user) {
        //             var favourite_music = user.favourite_music;
        //             lists.push(song._id);
        //             user.set('favourite_music', favourite_music);
        //             user.save(function (err) {
        //                if(err) {
        //                    res.status(200).json(err);
        //                    res.end();
        //                } else {
        //                    res.status(200).json("ok");
        //                    res.end();
        //                }
        //             });
        //         } else {
        //             req.session.msg = 'no user';
        //             res.status(200).json("no user");
        //             res.end();
        //         }
        //     });
    } else {
		res.status(200).json("no login");
		res.end();
	}
};