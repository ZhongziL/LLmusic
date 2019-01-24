var request = require('request');
var async = require('async');

exports.search_list = function (req, res) {
    var search_keyword = req.body.search_keyword;
    var page = req.body.page;
    var pagesize = req.body.pagesize;
    if (page === 'undefined') { page = 1; }
    if (pagesize === 'undefined') {pagesize = 1;}
    console.log(search_keyword, page, pagesize);

    var url = "http://songsearch.kugou.com/song_search_v2?keyword=" + search_keyword + "&page=" + page + "&pagesize=" + pagesize +
        "&userid=-1&clientver=&platform=WebFilter&tag=em&filter=2&iscorrection=1&privilege_filter=0";

    url = encodeURI(url);
    console.log(url);

    getName(url, function (err, data) {
        if (err) {
            console.log(err);
            res.status(200).json(err);
            res.end();
        }
        // console.log(url);
        console.log(data);

        res.status(200).json(data);
        res.end();
    });
};

function getName(url, callback) {
    request({
        url: url,
        method: "GET",
        json: true,
        async: false,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
        },
    }, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            // console.log(body.data.lists); // 请求成功的处理逻辑
            var lists = body.data.lists;
            var results = {songs: []};

            (function iterator(i) {
                // console.log("ok");
                // console.log(lists[i]);
                var song_name = lists[i].OriSongName;
                var singer_name = lists[i].SingerName;
                var fileHash = lists[i].FileHash;
                var albumID = lists[i].AlbumID;

                // console.log(song_name, singer_name, fileHash, albumID);

                var song = {
                    song_name: song_name,
                    singer_name: singer_name,
                    fileHash: fileHash,
                    albumID: albumID
                };

                geturl(song, function(err, body) {
                    if(err) callback(err);

                    song.img = body.data.img;
                    song.mp3 = body.data.play_url;
                    song.lyrics = body.data.lyrics;

                    results.songs.push(song);

                    if (i + 1 === lists.length) {
                        return callback(null, results);
                        // console.log(results);
                    } else {
                        iterator(i + 1);
                    }
                });
            })(0);
        } else {
            return callback(error);
        }
    });
}

function geturl(song, callback) {
    var fileHash = song.fileHash;
    var albumID = song.albumID;
    var mp3_url = "http://www.kugou.com/yy/index.php?r=play/getdata&hash=" + fileHash + "&album_id=" + albumID;
    request({
        url: mp3_url,
        method: "GET",
        json: true,
        async: false,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
        },
    }, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            //歌词
            img_url = body.data.img;
            mp3 = body.data.play_url;
            lyrics = body.data.lyrics;
            callback(null, body);
        } else {
            callback(error);
        }
    });
}
