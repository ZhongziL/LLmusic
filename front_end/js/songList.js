var list = null;
// 刷新页面
var renewList = function() {
    // 歌单信息填充
    // 头部信息
    if (list.id == "history")
        $(".img-box").css("background-image", "url(../resources/clock.png)");
    else if (list.id == "favourite")
        $(".img-box").css("background-image", "url(../resources/heart.png)");
    else
        $(".img-box").css("background-image", "url(../resources/music.png)");

    $(".song-list-info h1")[0].textContent = list.name;
    if (list.creater) $(".song-list-info p")[0].textContent = "创建者：" + list.creater;
    $(".song-list-info p")[1].textContent = list.description;
    // 列表项
    if (list.list) {
        $("#song-list ul").empty();
        $(".play-all").text("全部播放(" + list.list.length + ")")
        for (var i = 0; i < list.list.length; i++) {
            $("#song-list ul").append(
                '<li class="mui-table-view-cell mui-media">' +
                '   <span class="mui-media-object mui-pull-left list-cell-num">' + (i + 1) + '</span>' +
                '   <div class="mui-media-body list-cell-info">' +
                '       <p id="' + i + '" class="mui-ellipsis">' + list.list[i].song_name + '</p>' +
                '       <p class="mui-ellipsis">' + list.list[i].singer_name + '</p>' +
                '   </div>' +
                '   <span class="mui-icon mui-icon-more list-cell-more"></span>' +
                '</li>'
            );
        }
        // 列表项事件绑定
        $("#song-list li").bind(parent.tap, (event) => {
            var index = $(event.currentTarget).find("p")[0].id;
            parent.AudioManager.addListFront(list.list[index]);
            parent.AudioManager.setAudio(0);
            parent.AudioManager.audio.play();
        })
        $(".list-cell-more").bind(parent.tap, (event) => {
            event.stopPropagation()
            var song = $(event.currentTarget).parents('li').find('p')[0];
            $('#item-menu ul').attr('id', song.id)
            mui("#item-menu").popover('show');
        });
    } else {
        $(".play-all").text("全部播放(0)");
    }
}

window.onload = function() {
    mui.init({
        swipeBack: false
    });
    mui('.mui-scroll-wrapper').scroll();

    // 播放条刷新
    parent.AudioManager.init($('#play-nav')[0], $('#play-nav-queue')[0]);

    console.log(parent.PageManager.values)

    // 操作菜单更新
    list = {
        id: parent.PageManager.values.id,
        name: parent.PageManager.values.listName,
        creater: parent.PageManager.values.username
    }
    // 操作菜单：收藏到其他列表
    if (list.id != "favourite") $("#item-menu ul").append(
        '<li class="mui-table-view-cell item-menu-collect self-list-opt history-opt favourite-opt other-opt" id="favourite">标注为喜欢</li>'
    );
    parent.AudioManager.musicLists.forEach((item) => {
        if (item.id != list.id) $("#item-menu ul").append(
            '<li class="mui-table-view-cell item-menu-collect self-list-opt history-opt favourite-opt other-opt" id=' +
            item.id + '>收藏到：' +
            '   <span>' + item.name + '</span>' +
            '</li>');
    });
    $("#item-menu li").css("display", "none");
    $("#list-menu li").css("display", "none");
    // 根据情况显示选项
    if (list.id == "favourite") {
        _favourite()
    } else if (list.id == "history") {
        _history();
    } else {
        if (list.creater == parent.UserManager.userInfo.username)
            _self_list();
        else
            _other_list();
    }

    // 各按钮事件
    // 控制条
    $('.play-all').bind(parent.tap, (event) => {
        if (list.list && list.list.length > 0) {
            mui.toast('已开始播放', {
                duration: 'short',
                type: 'div'
            })
            parent.AudioManager.setAudioList(list.list);
            parent.AudioManager.setAudio(0);
            parent.AudioManager.audio.play();
        } else {
            mui.toast('列表为空');
        }
    });
    $(".control-bars").bind(parent.tap, () => {
        if (list == null) return;
        mui("#list-menu").popover("show");
    });

    // 项目菜单
    $("#item-menu-add").bind(parent.tap, (event) => {
        mui("#item-menu").popover('hide');
        var index = event.currentTarget.parentNode.id;
        parent.AudioManager.addListBack(list.list[index]);
        parent.AudioManager.audio.play();
    });
    $(".item-menu-collect").bind(parent.tap, (event) => {
        mui("#item-menu").popover('hide');
        parent.Tools.toast("添加中...");
        var song = list.list[event.currentTarget.parentNode.id];
        if (event.currentTarget.id == "favourite") {
            song.username = parent.UserManager.userInfo.username;
            parent.AudioManager.NET.loveSong({
                data: song,
                error: () => {
                    mui.toast("网络异常，请稍后重试");
                },
                success: (data) => {
                    if (data == "ok") {
                        mui.toast("收藏成功");
                    } else {
                        mui.toast("收藏失败")
                    }
                },
                complete: () => {
                    parent.Tools.closeToast()
                }
            })
        } else {
            song.list_id = list.id;
            parent.AudioManager.NET.addMusicToList({
                data: song,
                error: () => {
                    mui.toast("网络异常，请稍后重试");
                },
                success: (data) => {
                    if (data == "ok") {
                        mui.toast("收藏成功");
                    } else {
                        mui.toast("收藏失败")
                    }
                },
                complete: () => {
                    parent.Tools.closeToast()
                }
            })
        }
    })
    $("#item-menu-rm").bind(parent.tap, (event) => {
        mui("#item-menu").popover('hide');
        var index = event.currentTarget.parentNode.id;
        console.log(list.list[index])
        parent.Tools.toast("正在删除...");
        if (list.id == "history")
            for (var i = 0; i < parent.AudioManager.play_history.length; i++) {
                console.log(parent.AudioManager.play_history[i])
                if (parent.AudioManager.play_history[i] == list.list[index].id) {
                    parent.AudioManager.play_history.splice(i, 1);
                    parent.AudioManager.NET.insertPlay_history();
                    _history();
                    parent.Tools.closeToast();
                    break;
                }
            }
        else if (list.id == "favourite")
            parent.AudioManager.NET.removeFavouriteSong({
                data: {
                    song_id: list.list[index].id,
                    username: parent.UserManager.userInfo.username
                },
                error: () => {
                    mui.toast("网络异常，请稍后重试");
                },
                success: (data) => {
                    if (data.msg == "remove") {
                        list.list.splice(index, 1);
                        renewList();
                        mui.toast("删除成功");
                    }
                },
                complete: () => {
                    parent.Tools.closeToast();
                }
            })
        else
            parent.AudioManager.NET.removeSong({
                data: {
                    list_id: list.id,
                    song_id: list.list[index].id
                },
                error: () => {
                    mui.toast("网络异常，请稍后重试");
                },
                success: (data) => {
                    if (data == "ok") {
                        list.list.splice(index, 1);
                        renewList();
                        mui.toast("删除成功");
                    }
                },
                complete: () => {
                    parent.Tools.closeToast();
                }
            });
    });

    // 列表的菜单
    $("#list-menu-set").bind(parent.tap, () => {
        mui("#list-menu").popover("hide");
        parent.Tools.prompt("修改歌单信息", ['请输入新的歌单名'], ['确定', '取消'], (event) => {
            if (event.index == 0) {
                // 校验输入合法性
                var tmp = true;
                if (event.vals[0] == "") {
                    parent.mui.toast('请输入歌单名');
                    tmp = false;
                } else {
                    var lists = parent.AudioManager.musicLists;
                    for (var i = 0; i < lists.length; i++) {
                        if (event.vals[0] == lists[i].name) {
                            parent.mui.toast('歌单名已存在');
                            tmp = false;
                            break;
                        }
                    }
                }
                if (tmp) {
                    parent.Tools.closePrompt();
                    parent.Tools.toast("修改中...");
                    parent.AudioManager.NET.changeListName({
                        data: {
                            list_id: list.id,
                            list_name: event.vals[0]
                        },
                        error: () => {
                            mui.toast("网络异常，请稍后重试")
                        },
                        success: (data) => {
                            if (data == "ok") {
                                $(".song-list-info h1").text(event.vals[0])
                                mui.toast("修改成功")
                            }
                        },
                        complete: () => {
                            parent.Tools.closeToast();
                        }
                    })
                }
            } else {
                parent.Tools.closePrompt();
            }
        })
    })
    $("#list-menu-rm").bind(parent.tap, () => {
        mui("#list-menu").popover("hide");
        parent.Tools.toast("删除中...");
        parent.AudioManager.NET.removeList({
            data: {
                list_id: list.id,
                username: parent.UserManager.userInfo.username
            },
            error: () => {
                mui.toast("网络异常，请稍后重试")
            },
            success: (data) => {
                if (data == "ok") {
                    parent.PageManager.open("pages/index.html");
                    parent.mui.toast("删除成功")
                }
            },
            complete: () => {
                parent.Tools.closeToast();
            }
        });
    })
    $("#list-menu-clr").bind(parent.tap, () => {
        parent.AudioManager.NET.clearPlayHistory();
        parent.mui.toast("历史记录已清空");
        parent.PageManager.open("pages/index.html");
    });
    $("#list-menu-collect").bind(parent.tap, () => {
        mui("#list-menu").popover("hide");
        if ($("#list-menu-collect")[0].textContent == "收藏此列表") {
            parent.Tools.toast("添加中...");
            parent.AudioManager.NET.collectList({
                data: {
                    list_id: list.id,
                    username: parent.UserManager.userInfo.username
                },
                error: () => {
                    mui.toast("网络异常，请稍后重试")
                },
                success: (data) => {
                    if (data == "ok") {
                        mui.toast("收藏成功");
                        $("#list-menu-collect").text("取消收藏")
                    }
                    console.log(data)
                },
                complete: () => {
                    parent.Tools.closeToast();
                }
            });
        } else {
            parent.Tools.toast("取消收藏...");
            parent.AudioManager.NET.removeCollectList({
                data: {
                    list_id: list.id,
                    username: parent.UserManager.userInfo.username
                },
                error: () => {
                    mui.toast("网络异常，请稍后重试")
                },
                success: (data) => {
                    if (data == "ok") {
                        mui.toast("已经取消收藏");
                        $("#list-menu-collect").text("收藏此列表")
                    }
                    console.log(data)
                },
                complete: () => {
                    parent.Tools.closeToast();
                }
            });
        }
    })

    // 页面跳转
    $('.nav-back').bind(parent.tap, () => {
        parent.parent.PageManager.reBack();
    });
}

function _self_list() {
    $(".self-list-opt").css("display", "block");
    var id = parent.PageManager.values.id;
    parent.AudioManager.NET.getMusicInList({
        data: {
            musicList_id: id
        },
        error: () => {
            mui.toast("网络异常，请稍后重试");
        },
        success: (data) => {
            $(".mui-loading").remove()
            list = parent.AudioManager.getListById(id);
            list.list = data.name_list;
            renewList();
        }
    })
}

function _other_list() {
    for (var i = 0; i < parent.AudioManager.collectLists.length; i++) {
    	if (parent.AudioManager.collectLists[i].id == list.id) {
            $("#list-menu-collect").text("取消收藏");
            break;
        }
    }
    
    $(".other-opt").css("display", "block");
    parent.AudioManager.NET.getMusicInList({
        data: {
            musicList_id: list.id
        },
        error: () => {
            mui.toast("网络异常，请稍后重试");
        },
        success: (data) => {
            if (data.name_list) {
                $(".mui-loading").remove()
                list.list = data.name_list;
                renewList();
            } else {
                mui.toast("获取失败，请稍后重试")
            }
        }
    })
}

function _history() {
    parent.AudioManager.NET.getPlay_history();
    $(".history-opt").css("display", "block");
    list.name = "最近播放";
    list.description = "最近播放过的音乐";
    renewList();
    var proms = [];
    parent.AudioManager.play_history.forEach((item) => {
        if (item != null)
            proms.push(new Promise((resolve, reject) => {
                parent.AudioManager.NET.getSong({
                    data: {
                        music_id: item
                    },
                    error: reject,
                    success: (data) => {
                        if (data.id)
                            resolve(data);
                        else
                            reject();
                    }
                })
            }));
    });
    Promise.all(proms).then((data) => {
        list.list = data;
        renewList();
    }).catch((data) => {
        $(".mui-loading").remove()
        mui.toast("获取失败，请稍后重试");
    });
}

function _favourite() {
    $(".favourite-opt").css("display", "block");
    list.name = "我喜欢";
    list.description = "标注为喜欢的音乐";
    renewList();
    parent.AudioManager.NET.getFavouriteSongList({
        error: () => {
            mui.toast("网络异常，请稍后重试");
        },
        success: (data, text) => {
            console.log(data)
            if (data.name_list) {
                $(".mui-loading").remove()
                list.list = data.name_list;
                renewList();
            } else {
                mui.toast("获取失败，请稍后重试")
            }
        }
    });
}
