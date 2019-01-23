var request = require('request');

var data = {
	username: 'Liu',
	password: '123456'
};

data = JSON.stringify(data);
//console.log(data);

function httprequest(url,data) {
    request({
        url: post_url,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: data
    }, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body) // 请求成功的处理逻辑
        }
    });
}

var post_url = "http://localhost:5000/register";
// httprequest(post_url,data);

function loginrequest(url,data) {
    request({
        url: url,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: data
    }, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body) // 请求成功的处理逻辑
        }
    });
}

function logoutrequest(url, data) {
    request({
        url: url,
        method: "GET",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: data
    }, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body) // 请求成功的处理逻辑
        }
    });
}

var login_url = "http://172.18.160.110:5000/login";
// loginrequest(login_url, data);
//
// loginrequest(login_url, data);

var logout = "http://localhost:5000/logout";
// logoutrequest(logout, data);


var url = "http://localhost:5000/searchSong";
var search_data = {
    search_keyword : "周杰伦",
    page: 1,
    pagesize: 1
};

function searchrequest(url, data) {
    request({
        url: url,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: data
    }, function(error, response, body) {
        // console.log("???");
        if (!error && response.statusCode === 200) {
            console.log(body); // 请求成功的处理逻辑
            var songs = body.songs;
            for (song in songs) {
                // console.log(song);
                var songd = {
                    song_hash : songs[song].fileHash,
                    song_name : songs[song].song_name,
                    singer: songs[song].singer_name,
                    song_url: songs[song].mp3,
                    song_words: songs[song].lyrics,
                    song_img: songs[song].img,
                    list_id: "5c47ffbb4b89830efc0f1b87"
                };

                console.log(songd);
                request({
                    url: "http://localhost:5000/addMusic",
                    method: "POST",
                    json: true,
                    headers: {
                        "content-type": "application/json",
                    },
                    body: songd
                }, function (err, res, bodys) {
                    if (!err && res.statusCode === 200) {
                        console.log(bodys);
                    } else {
                        console.log(err);
                    }
                });
            }
        } else {
            console.log(error);
        }
    });
}

searchrequest(url, search_data);
var data1 = {
    username: "Liu",
    list_id: "5c22fa7662a9da74c8ac15b3"
};
function removeListrequest(url, data) {
    request({
        url: url,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: data
    }, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body) // 请求成功的处理逻辑
        }
    });
}

var url1 = "http://localhost:5000/removeUserList";
// removeListrequest(url1, data1);