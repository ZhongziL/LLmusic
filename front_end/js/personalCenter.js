// 当前页面要显示谁的信息
var userInfo = null;

function addSelfList() {
    $("#self-lists").empty()
    userInfo.musiclists.forEach((item) => {
        $("#self-lists").append(
            '<li class="mui-table-view-cell mui-media" id=' + item.id + '>' +
            '	<a class="mui-navigate-right">' +
            '		<img class="mui-media-object mui-pull-left" src="../resources/music.png">' +
            '		<div class="mui-media-body"><span>' + item.name + '</span>' +
            '			<p class="mui-ellipsis">' + item.description + '</p>' +
            '		</div>' +
            '	</a>' +
            '</li>'
        )
    });
    $("#self-lists li").bind(parent.tap, (event) => {
        parent.PageManager.values = {
            id: event.currentTarget.id,
            listName: $(event.currentTarget).find("span")[0].textContent,
            username: userInfo.username
        }
        parent.PageManager.open('pages/songList.html');
    });
}

function addCollcetList() {
    $("#user-lists-title").css("display", "block");
    $("#user-lists-title p").text("收藏歌单 " + userInfo.collectLists.length)
    $("#collect-lists").empty();
    userInfo.collectLists.forEach((item) => {
        $("#collect-lists").append(
            '<li class="mui-table-view-cell mui-media" id=' + item.id + '>' +
            '	<a class="mui-navigate-right">' +
            '		<img class="mui-media-object mui-pull-left" src="../resources/music.png">' +
            '		<div class="mui-media-body"><span>' + item.name + '</span>' +
            '			<p class="mui-ellipsis">' + item.description + '</p>' +
            '		</div>' +
            '	</a>' +
            '</li>'
        )
    });
    $("#collect-lists li").bind(parent.tap, (event) => {
        parent.PageManager.values = {
            id: event.currentTarget.id,
            listName: $(event.currentTarget).find("span")[0].textContent,
            username: null
        }
        parent.PageManager.open('pages/songList.html');
    });
}

function renewFocusInfo() {
    $("#focus span")[0].textContent = "...";
    $("#fans span")[0].textContent = "...";
    parent.UserManager.getUserFocus({
        data: {
            username: userInfo.username
        },
        error: () => {
            mui.toast("关注列表获取失败");
        },
        success: (data) => {
            if (data.focus_list) {
                userInfo.focus_list = data.focus_list;
                $("#focus span")[0].textContent = userInfo.focus_list.length;
                $("#focus").bind(parent.tap, () => {
                    parent.PageManager.values = userInfo;
                    parent.PageManager.values.targer = "focus";
                    parent.PageManager.open("pages/userList.html");
                })
            } else {
                console.log(data)
            }
        }
    })
    parent.UserManager.getUserFans({
        data: {
            username: userInfo.username
        },
        error: () => {
            mui.toast("关注列表获取失败");
        },
        success: (data) => {
            if (data.fans_list) {
                userInfo.fans_list = data.fans_list;
                $("#fans span")[0].textContent = userInfo.fans_list.length;
                $("#fans").bind(parent.tap, () => {
                    parent.PageManager.values = userInfo;
                    parent.PageManager.values.targer = "fans";
                    parent.PageManager.open("pages/userList.html");
                })
            } else {
                console.log(data)
            }
        }
    })
}

window.onload = function() {
    mui.init({
        swipeBack: true
    }); // 启用右滑关闭功能
    mui('.mui-scroll-wrapper').scroll();

    userInfo = parent.PageManager.values;

    if (parent.UserManager.isLogin())
        if (parent.UserManager.userInfo.username == userInfo.username) {
            $("#focus-menu .other").css("display", "none");
            $("#focus-menu .self").css("display", "block");
        } else {
            $("#focus-menu .other").css("display", "block");
            $("#focus-menu .self").css("display", "none");
        }

    parent.UserManager.get_user_avatar({
        data: {
            username: userInfo.username
        },
        success: (data) => {
            if (data.picture) {
                userInfo.avatar = "data:image/png;base64," + data.picture;
                $(".user-avatar").css("background-image", "url(" + userInfo.avatar + ")");
            }
        }
    })
    $("#user-part p").text(userInfo.username)

    parent.AudioManager.NET.getMusicLists({
        data: {
            username: userInfo.username
        },
        error: () => {
            mui.toast("网络异常，获取歌单失败");
        },
        success: (data) => {
            if (data.name_list) {
                userInfo.musiclists = data.name_list;
                addSelfList();
            }
        }
    });
    parent.AudioManager.NET.getCollectLists({
        data: {
            username: userInfo.username
        },
        error: () => {
            mui.toast("网络异常，获取歌单失败");
        },
        success: (data) => {
            if (data.name_list) {
                userInfo.collectLists = data.name_list;
                addCollcetList();
            }
        }
    });

    renewFocusInfo();

    $("header .mui-icon-more").bind(parent.tap, () => {
        if (parent.UserManager.isLogin())
            mui("#focus-menu").popover("show");
    });

    $("#focus-menu .other").bind(parent.tap, () => {
        mui("#focus-menu").popover("hide");
        parent.Tools.toast("关注中...");
        parent.UserManager.focusUser({
            data: {
                oriUsername: parent.UserManager.userInfo.username,
                targetUsername: userInfo.username
            },
            error: () => {
                mui.toast("网络异常，请重试");
            },
            success: (data) => {
                console.log(data)
                mui.toast("关注成功");
            },
            complete: () => {
                parent.Tools.closeToast();
            }
        })
    });

    $("#focus-menu .self").bind(parent.tap, () => {
        parent.PageManager.open("pages/chooseAvatar.html");
    });

    $('.nav-back').bind('click', parent.PageManager.reBack);

};
