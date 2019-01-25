// 解决一个奇怪的BUG
var llmusic = null;

// 刷新页面上的歌单列表
function addLists(type) {
    var lists;
    if (type == "self") {
        $("li.self").remove();
        lists = llmusic.AudioManager.musicLists;
    } else {
        $("li.collect").remove();
        lists = llmusic.AudioManager.collectLists;
    }
    for (var i = 0; i < lists.length; i++) {
        if (!lists[i].cover)
            lists[i].cover = "../resources/music.png"
        if (!lists[i].description)
            lists[i].description = "";

        $('#scroll-lists ul').append(
            '<li class="mui-table-view-cell mui-media song-list-cell ' + type + '" id="' + lists[i].id + '" >' +
            '	<a class="mui-navigate-right">' +
            '		<img class="mui-media-object mui-pull-left" src="' + lists[i].cover + '">' +
            '		<div class="mui-media-body"><span>' + lists[i].name + '</span>' +
            '			<p class="mui-ellipsis">' + lists[i].description + '</p>' +
            '		</div>' +
            '	</a>' +
            '</li>'
        );
    }
}

function addListener() {
    // 列表项事件绑定
    $('.song-list-cell').bind(llmusic.tap, (event) => {
        if (event.currentTarget.className.includes("self"))
            llmusic.PageManager.values = {
                id: event.currentTarget.id,
                listName: $(event.currentTarget).find("span")[0].textContent,
                username: llmusic.UserManager.userInfo.username
            }
        else
            llmusic.PageManager.values = {
                id: event.currentTarget.id,
                listName: $(event.currentTarget).find("span")[0].textContent,
                username: null
            }
        llmusic.PageManager.open('pages/songList.html');
    });
}

window.onload = function() {
    mui.init({
        swipeBack: false,
        statusBarBackground: 'darkcyan'
    });
    mui('.mui-scroll-wrapper').scroll();

    llmusic = parent.parent;

    // 搜索框
    $("#search-box div").bind(llmusic.tap, () => {
        llmusic.PageManager.open("pages/search.html")
    })

    // 用户信息填充
    if (llmusic.UserManager.isLogin()) {
        if (llmusic.UserManager.userInfo.avatar)
            $("#user-photo").css("background-image", "url(" + llmusic.UserManager.userInfo.avatar + ")");
        else
            llmusic.UserManager.get_user_avatar({
                data: {
                    username: llmusic.UserManager.userInfo.username
                },
                success: (data) => {
                    if (data.picture) {
                        userInfo.avatar = "data:image/png;base64," + data.picture;
                        $("#user-photo").css("background-image", "url(" + userInfo.avatar + ")");
                    }
                }
            })
        $('#user-name').text(llmusic.UserManager.userInfo.username);
    }

    // 用户条事件绑定
    $('#personal-card').bind(llmusic.tap, (event) => {
        if (llmusic.UserManager.isLogin()) {
            llmusic.PageManager.values = llmusic.UserManager.userInfo;
            llmusic.PageManager.open('pages/personalCenter.html');
        } else
            llmusic.PageManager.open('pages/signIn.html');
    });

    // 特殊列表
    if (llmusic.AudioManager.play_history.length != 0)
        $("#history .song-number").text(llmusic.AudioManager.play_history.length)
    if (llmusic.AudioManager.favourite.length != 0)
        $("#favourite .song-number").text(llmusic.AudioManager.favourite.length)
    $(".main-list").bind(llmusic.tap, (event) => {
        llmusic.PageManager.values = {
            id: event.currentTarget.id,
            username: llmusic.UserManager.userInfo.username
        }
        llmusic.PageManager.open('pages/songList.html');
    });

    // 列表填充
    $('#scroll-lists ul').empty();
    var proms = [];
    proms.push(new Promise((resolve, reject) => {
        llmusic.AudioManager.NET.getMusicLists({
            data: {
                username: llmusic.UserManager.userInfo.username
            },
            error: (req, err, expected) => {
                mui.toast('获取自建歌单失败');
            },
            success: (data, text) => {
                if (data.name_list) {
                    addLists("self");
                    resolve(data);
                } else {
                    reject('获取自建歌单失败');
                }
            }
        });
    }));
    proms.push(new Promise((resolve, reject) => {
        llmusic.AudioManager.NET.getCollectLists({
            data: {
                username: llmusic.UserManager.userInfo.username
            },
            error: (req, err, expected) => {
                mui.toast('获取收藏歌单失败');
            },
            success: (data, text) => {
                if (data.name_list) {
                    addLists("collect");
                    resolve(data);
                } else {
                    reject('获取收藏歌单失败');
                }
            }
        });
    }));
    Promise.all(proms).then((data) => {
        $(".mui-loading").remove();
        addListener();
        if ($(".listClass-active")[0].textContent == "自建歌单") {
            $("#scroll-lists li.self").css("display", "block");
            $("#scroll-lists li.collect").css("display", "none");
        } else {
            $("#scroll-lists li.self").css("display", "none");
            $("#scroll-lists li.collect").css("display", "block");
        }
    }).catch((data) => {
        console.log(data)
        mui.toast("获取失败，请稍后重试");
    });

    // 切换列表种类
    $('#list-title span').bind(llmusic.tap, (event) => {
        mui('.mui-scroll-wrapper').scroll().scrollTo(0,0,100);
        if (!event.currentTarget.className.includes('listClass-active')) {
            var spans = $('#list-title span')
            if (spans[0].className == "listClass-active") {
                spans[0].className = '';
                spans[1].className = 'listClass-active';
                $("#scroll-lists li.self").css("display", "none");
                $("#scroll-lists li.collect").css("display", "block");
            } else {
                spans[0].className = 'listClass-active';
                spans[1].className = '';
                $("#scroll-lists li.self").css("display", "block");
                $("#scroll-lists li.collect").css("display", "none");
            }
        }
    });

    // 新建歌单
    $("#create-list").bind(llmusic.tap, (event) => {
        if (!llmusic.UserManager.isLogin()) {
            mui.toast('请先登录')
            return;
        }
        llmusic.Tools.prompt('新建歌单', ['请输入歌单名', '请输入描述'], ['确定', '取消'], (event) => {
            if (event.index == 0) {
                // 校验输入合法性
                var tmp = true;
                if (event.vals[0] == "") {
                    llmusic.mui.toast('请输入歌单名');
                    tmp = false;
                } else {
                    var lists = llmusic.AudioManager.musicLists;
                    for (var i = 0; i < lists.length; i++) {
                        if (event.vals[0] == lists[i].name) {
                            llmusic.mui.toast('歌单名已存在');
                            tmp = false;
                            break;
                        }
                    }
                }
                if (tmp) {
                    // 新建歌单
                    llmusic.Tools.closePrompt();
                    llmusic.Tools.toast("正在创建...");
                    llmusic.AudioManager.NET.addMusicList({
                        data: {
                            name: event.vals[0],
                            description: event.vals[1],
                            username: llmusic.UserManager.userInfo.username
                        },
                        error: (req, err, expected) => {
                            mui.toast('添加失败');
                        },
                        success: (data, text) => {
                            if (data.list_id) {
                                addLists("self");
                                addListener();
                            } else {
                                mui.toast('添加失败');
                            }
                        },
                        complete: () => {
                            llmusic.Tools.closeToast();
                        }
                    })
                }
            } else if (event.index == "1") {
                llmusic.Tools.closePrompt();
            }
        });
    });
}
