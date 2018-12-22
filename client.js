var request = require('request');

var data = {
	username: 'liu',
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

var login_url = "http://localhost:5000/login";
loginrequest(login_url, data);

loginrequest(login_url, data);

var logout = "http://localhost:5000/logout";
// logoutrequest(logout, data);