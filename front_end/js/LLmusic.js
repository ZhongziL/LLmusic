// 全局信息
var tap = 'tap'; // 啊好烦啊tap还是click，判断后给其他人用吧
var server_addr = 'http://172.18.160.110:5000/'; // 服务器地址
var userInfo = null; // 用户信息


// 用户信息管理器
// 除了保存用户的基本信息,还有相应的处理函数


var UserManager = {
    // 用户信息
    userInfo: null,

    // 初始化：检查一下登录状态
    _init: function() {
        if ($.cookie('userInfo')) {
            UserManager.userInfo = JSON.parse($.cookie('userInfo'));
            setTimeout(UserManager._loginOverdue, parseInt($.cookie('loginDDL')) - new Date().getTime());
            
            // 获取一下头像
            UserManager.get_user_avatar({
                data: {
                    username: UserManager.userInfo.username
                },
                success: (data) => {
                    if (data.picture)
                        UserManager.userInfo.avatar = "data:image/png;base64," + data.picture;
                }
            })
        }
    },

    // 是否登录
    isLogin: function() {
        return (UserManager.userInfo != null);
    },

    // 登入
    login: function(Obj) {
        if (Obj) $.ajax({
            url: server_addr + 'login',
            method: 'post',
            timeout: 30000,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: Obj.data,
            error: Obj.error,
            success: (data, text) => {
                UserManager._loginSuccessCallback(data, text);
                if (Obj.success)
                    Obj.success(data, text);
            },
            complete: Obj.complete
        });
    },
    _loginSuccessCallback: function(data, text) {
        if (data.username) {
            UserManager.userInfo = data;
            $.cookie('userInfo', JSON.stringify(data), {
                expires: new Date(new Date().getTime() + 3 * 60 * 60 * 1000),
                path: '/'
            });
            $.cookie('loginDDL', new Date().getTime() + 3 * 60 * 60 * 1000, {
                expires: new Date(new Date().getTime() + 3 * 60 * 60 * 1000),
                path: '/'
            })
        }
        setTimeout(UserManager._loginOverdue, 3 * 60 * 60 * 1000)
    },
    _loginOverdue: function() {
        if (!$.cookie('userInfo') || $.cookie('userInfo') == "") {
            PageManager.open("pages/index.html");
            mui.toast("登录凭据过期，请重新登录");
            UserManager.userInfo = null;
            AudioManager.musicLists = [];
            AudioManager.favourite = [];
        }
    },

    // 注册
    register: function(Obj) {
        if (Obj) $.ajax({
            url: server_addr + 'register',
            method: 'post',
            timeout: 30000,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: Obj.data,
            error: Obj ? Obj.error : null,
            success: (data, text) => {
                UserManager._loginSuccessCallback(data, text);
                if (Obj.success)
                    Obj.success(data, text);
            },
            complete: Obj ? Obj.complete : null
        })
    },

    // 登出
    logout: function(Obj) {
        $.ajax({
            url: server_addr + 'logout',
            method: 'get',
            timeout: 30000,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            error: Obj ? Obj.error : null,
            success: Obj ? Obj.success : null,
            complete: (data, text) => {
                UserManager.userInfo = null;
                $.cookie('userInfo', '', {
                    expires: -1,
                    path: '/'
                });
                if (Obj && Obj.complete)
                    Obj.complete(data, text);
            }
        });
    },
    
    // 获取所有头像
    get_all_avatar: function(Obj) {
        $.ajax({
            url: server_addr + 'get_all_avatar',
            method: 'get',
            timeout: 30000,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            error: Obj ? Obj.error : null,
            success: Obj ? Obj.success : null,
            complete: Obj ? Obj.complete : null
        })
    },

    // 获取头像
    get_user_avatar: function(Obj) {
        $.ajax({
            url: server_addr + 'get_user_avatar',
            method: 'post',
            timeout: 30000,
            xhrFields: {
                withCredentials: true
            },
            data: Obj.data,
            crossDomain: true,
            error: Obj ? Obj.error : null,
            success: Obj ? Obj.success : null,
            complete: Obj ? Obj.complete : null
        });
    },
    
    // 修改头像
    change_avatar: function(Obj) {
        Obj.data.username = UserManager.userInfo.username;
        $.ajax({
            url: server_addr + 'change_avatar',
            method: 'post',
            timeout: 30000,
            xhrFields: {
                withCredentials: true
            },
            data: Obj.data,
            crossDomain: true,
            error: Obj ? Obj.error : null,
            success: (data, text) => {
                console.log(data)
                if (Obj.success)
                    Obj.success(data, text);
            },
            complete: Obj ? Obj.complete : null
        })
    },

    // 搜人
    searchUser: function(Obj) {
        if (!Obj.data) return;
        $.ajax({
            url: server_addr + 'searchUser',
            method: 'post',
            timeout: 30000,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: Obj.data,
            error: Obj.error ? Obj.error : null,
            success: Obj.success ? Obj.success : null,
            complete: Obj.complete ? Obj.complete : null
        })
    },
    
    // 获取关注列表
    getUserFocus: function(Obj) {
        if (!Obj.data) return;
        $.ajax({
            url: server_addr + 'getUserFocus',
            method: 'post',
            timeout: 30000,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: Obj.data,
            error: Obj.error ? Obj.error : null,
            success: Obj.success ? Obj.success : null,
            complete: Obj.complete ? Obj.complete : null
        })
    },
    // 获取粉丝列表
    getUserFans: function(Obj) {
        if (!Obj.data) return;
        $.ajax({
            url: server_addr + 'getUserFans',
            method: 'post',
            timeout: 30000,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: Obj.data,
            error: Obj.error ? Obj.error : null,
            success: Obj.success ? Obj.success : null,
            complete: Obj.complete ? Obj.complete : null
        })
    },

    // 关注
    focusUser: function(Obj) {
        if (!Obj.data) return;
        $.ajax({
            url: server_addr + 'focusUser',
            method: 'post',
            timeout: 30000,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: Obj.data,
            error: Obj.error ? Obj.error : null,
            success: Obj.success ? Obj.success : null,
            complete: Obj.complete ? Obj.complete : null
        })
    }
}


// 音乐管理器
var AudioManager = {
    // 播放器元素
    audio: null,
    // 用户的播放列表
    musicLists: [],
    // 收藏的歌单列表
    collectLists: [],
    // 本地音乐列表
    localList: [],
    // “我喜欢”
    favourite: [],
    // 播放历史
    play_history: [],
    // 搜索历史
    search_history: [],
    // 当前播放列表
    audioList: [],
    // 当前播放曲目的位置
    audioIndex: -1,
    // 是否循环
    isLoop: false,

    // 当前的条和播放列表元素
    currentNav: null,
    currentQueue: null,

    // 基本初始化
    _init: function() {
        AudioManager.audio = document.createElement('AUDIO');
        AudioManager.audio.addEventListener('play', (event) => {
            // 子页面自定义的
            if ($("#main")[0].contentWindow.audio_onPlay)
                $("#main")[0].contentWindow.audio_onPlay();
            if (AudioManager.currentNav)
                $(AudioManager.currentNav).find('#play-nav-button-play').css("background-image",
                    "url(../resources/pause.png)");
        });
        AudioManager.audio.addEventListener('pause', (event) => {
            if (AudioManager.currentNav)
                $(AudioManager.currentNav).find('#play-nav-button-play').css("background-image",
                    "url(../resources/play.png)");
        });
        AudioManager.audio.addEventListener("ended", () => {
            if (AudioManager.audioIndex < AudioManager.audioList.length - 1) {
                AudioManager.setAudio(AudioManager.audioIndex + 1);
                AudioManager.audio.play();
            } else if (AudioManager.audioIndex == AudioManager.audioList.length - 1 && AudioManager.isLoop) {
                AudioManager.setAudio(0);
                AudioManager.audio.play();
            } else if (AudioManager.currentNav) {
                $(AudioManager.currentNav).find('#play-nav-button-play').css("background-image",
                    "url(../resources/play.png)");
            }
            // 子页面自定义的
            if ($("#main")[0].contentWindow.audio_onEnd)
                $("#main")[0].contentWindow.audio_onEnd();
        });
        AudioManager.audio.addEventListener("canplay", () => {
            if ($("#main")[0].contentWindow.audio_onCanplay)
                $("#main")[0].contentWindow.audio_onCanplay();
        })

        AudioManager.NET.getPlay_history();
        if (UserManager.isLogin())
            AudioManager.NET.getFavouriteSongList();
    },

    // 基本控制: 播放列表中的设定当前播放曲目
    // index: 在播放列表中的位置
    setAudio: function(index) {
        AudioManager.audioIndex = index;
        if (index != -1)
            AudioManager.audio.src = AudioManager.audioList[AudioManager.audioIndex].song_url;
        if (index == -1)
            AudioManager.audio.src = null
        AudioManager.renewPlayNav();
        AudioManager.renewPlayQueue();

        // 插入历史记录
        if (index != -1)
            AudioManager.NET.insertPlay_history(AudioManager.audioList[AudioManager.audioIndex].id);
    },
    // 基本控制：切换播放状态
    toggle: function() {
        if (AudioManager.audio.paused) {
            AudioManager.audio.play();
        } else {
            AudioManager.audio.pause();
        }
    },

    // 列表相关: 根据ID获取列表
    getListById: function(id) {
        for (var i = 0; i < AudioManager.musicLists.length; i++) {
            if (AudioManager.musicLists[i].id == id)
                return AudioManager.musicLists[i];
        }
        return null;
    },

    // 列表相关：获取本地音乐列表
    getLoaclMusicList: function() {
        return {
            name: "本地音乐",
            description: "目前已经下载在本地的音乐"
        }
    },

    // 列表相关控制: 设置新的播放列表
    setAudioList: function(list) {
        AudioManager.audioList = list;
    },

    // 列表相关控制: 添加到播放列表最后面
    addListBack: function(song) {
        AudioManager._rmDuplicate(song.id);
        AudioManager.audioList.push(song);
        AudioManager.renewPlayQueue();
        $(AudioManager.currentQueue.getElementsByTagName('li')[AudioManager.audioList.length - 1]).bind(tap,
            AudioManager._queueItemClicked);
        if (AudioManager.audioList.length == 1)
            AudioManager.setAudio(0);
    },

    // 列表相关控制: 添加到播放列表最前面
    addListFront: function(song) {
        AudioManager._rmDuplicate(song.id);
        AudioManager.audioList.unshift(song);
        AudioManager.renewPlayQueue();
        $(AudioManager.currentQueue.getElementsByTagName('li')[0]).bind(tap, AudioManager._queueItemClicked);
        if (AudioManager.audioList.length == 1)
            AudioManager.setAudio(0);
    },

    // 列表相关控制: 添加到播放列表正在播放的下一位
    addListNext: function(song) {
        AudioManager._rmDuplicate(song.id);
        AudioManager.audioList.splice(AudioManager.audioIndex + 1, 0, song);
        AudioManager.renewPlayQueue();
        $(AudioManager.currentQueue.getElementsByTagName('li')[AudioManager.audioIndex + 1]).bind(tap,
            AudioManager._queueItemClicked);
        if (AudioManager.audioList.length == 1)
            AudioManager.setAudio(0);
    },
    _rmDuplicate: function(id) {
        for (let i = 0; i < AudioManager.audioList.length; i++) {
            if (AudioManager.audioList[i].id == id) {
                AudioManager.audioList.splice(i, 1);
                break;
            }
        }
    },

    // 子页面初始化
    init: function(navElem, queueElem) {
        AudioManager.currentNav = navElem;
        AudioManager.currentQueue = queueElem;

        // 样式和内容刷新
        AudioManager.renewPlayNav();
        AudioManager.renewPlayQueue();

        // 事件绑定:播放按钮
        $(AudioManager.currentNav).find('#play-nav-button-play').bind(tap, (event) => {
            event.stopPropagation();
            if (AudioManager.audio.src == '') {
                if (AudioManager.audioList.length == 0) {
                    mui.toast('播放列表为空');
                } else {
                    AudioManager.setAudio(0);
                    AudioManager.audio.play();
                }
            } else {
                AudioManager.toggle();
            }
            AudioManager.renewPlayNav();
        });
        // 事件绑定：播放列表按钮
        $(AudioManager.currentNav).find('#play-nav-button-queue').bind(tap, (event) => {
            event.stopPropagation();
            if (AudioManager.audioList.length > 0)
                event.originalEvent.path[event.originalEvent.path.length - 1].mui(AudioManager.currentQueue)
                .popover('show');
            else
                mui.toast('播放列表为空')
        });
        // 事件绑定：清空播放列表
        $(AudioManager.currentQueue).find("button").bind(tap, (event) => {
            AudioManager.setAudioList([]);
            AudioManager.setAudio(-1);
            event.originalEvent.path[event.originalEvent.path.length - 1].mui(AudioManager.currentQueue)
                .popover('hide');
        })
        // 事件绑定：播放条
        $(AudioManager.currentNav).bind(tap, (event) => {
            if (AudioManager.audioList.length > 0)
                PageManager.open("pages/player.html");
            else
                mui.toast('播放列表为空');
        });
    },

    // 子页面相关: 根据当前状态设置播放条的样式和内容
    renewPlayNav: function() {
        if (AudioManager.audioIndex != -1) {
            $(AudioManager.currentNav).find('#play-nav-cover').css("background-image",
                "url(" + AudioManager.audioList[AudioManager.audioIndex].song_img + ")");
            $(AudioManager.currentNav).find('p')[0].textContent =
                AudioManager.audioList[AudioManager.audioIndex].song_name;
            $(AudioManager.currentNav).find('p')[1].textContent =
                AudioManager.audioList[AudioManager.audioIndex].singer_name;
        } else {
            $(AudioManager.currentNav).find('#play-nav-cover').css("background-image",
                "url(../resources/llmusic.svg)");
            $(AudioManager.currentNav).find('p')[0].textContent = "";
            $(AudioManager.currentNav).find('p')[1].textContent = "";
        }
        if (AudioManager.audio.paused) {
            $(AudioManager.currentNav).find('#play-nav-button-play').css("background-image",
                "url(../resources/play.png)");
        } else {
            $(AudioManager.currentNav).find('#play-nav-button-play').css("background-image",
                "url(../resources/pause.png)");
        }
    },

    // 子页面相关: 根据当前状态设置播放列表的样式和内容
    renewPlayQueue: function() {
        $(AudioManager.currentQueue).children('ul').empty();
        for (var i = 0; i < AudioManager.audioList.length; i++) {
            $(AudioManager.currentQueue).children('ul').append('<li id="' + i + '" ' +
                'class="mui-table-view-cell">' + AudioManager.audioList[i].song_name + '</li>');
        }

        if (AudioManager.audioList.length != 0)
            $(AudioManager.currentQueue.getElementsByTagName('li')).bind(tap, AudioManager._queueItemClicked);
    },
    _queueItemClicked: function(event) {
        AudioManager.setAudio(parseInt(event.currentTarget.id));
        AudioManager.audio.play();
        event.originalEvent.path[event.originalEvent.path.length - 1].mui(AudioManager.currentQueue)
            .popover('hide');
    },

    // 网络相关
    NET: {
        // 获取歌曲信息
        getSong: function(Obj) {
            $.ajax({
                url: server_addr + 'getSong',
                method: 'get',
                timeout: 30000,
                xhrFields: {
                    withCredentials: true
                },
                data: Obj.data,
                crossDomain: true,
                error: Obj ? Obj.error : null,
                success: (data, text) => {
                    if (data.song_hash) {
                        data.id = Obj.data.music_id;
                    }
                    if (Obj.success)
                        Obj.success(data, text);
                },
                complete: Obj ? Obj.complete : null
            });
        },

        // 获取歌单列表
        getMusicLists: function(Obj) {
            $.ajax({
                url: server_addr + 'getMusicLists',
                method: 'get',
                timeout: 30000,
                xhrFields: {
                    withCredentials: true
                },
                data: Obj.data,
                crossDomain: true,
                error: Obj ? Obj.error : null,
                success: (data, text) => {
                    if (data.name_list)
                        AudioManager.musicLists = data.name_list;
                    if (Obj && Obj.success)
                        Obj.success(data, text);
                },
                complete: Obj ? Obj.complete : null
            });
        },

        // 获取歌单内容
        getMusicInList: function(Obj) {
            $.ajax({
                url: server_addr + 'getMusicInList',
                method: 'get',
                timeout: 30000,
                xhrFields: {
                    withCredentials: true
                },
                data: Obj.data,
                crossDomain: true,
                error: Obj ? Obj.error : null,
                success: Obj ? Obj.success : null,
                complete: Obj ? Obj.complete : null
            });
        },

        // 获取“我喜欢”
        getFavouriteSongList: function(Obj) {
            $.ajax({
                url: server_addr + 'getFavouriteSongList',
                method: 'post',
                timeout: 30000,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                data: {
                    username: UserManager.userInfo.username
                },
                error: Obj ? Obj.error : null,
                success: function(data, text) {
                    if (data.name_list)
                        AudioManager.favourite = data.name_list;
                    if (Obj && Obj.success) Obj.success(data, text);
                },
                complete: Obj ? Obj.complete : null,
            });
        },

        // 添加到我喜欢
        loveSong: function(Obj) {
            $.ajax({
                url: server_addr + 'loveSong',
                method: 'post',
                timeout: 30000,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                data: Obj.data,
                error: Obj ? Obj.error : null,
                success: Obj ? Obj.success : null,
                complete: Obj ? Obj.complete : null
            })
        },
        
        // 取消喜欢
        removeFavouriteSong: function(Obj) {
            $.ajax({
                url: server_addr + 'removeFavouriteSong',
                method: 'post',
                timeout: 30000,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                data: Obj.data,
                error: Obj ? Obj.error : null,
                success: Obj ? Obj.success : null,
                complete: Obj ? Obj.complete : null
            })
        },

        // 创建新歌单
        addMusicList: function(Obj) {
            $.ajax({
                url: server_addr + 'addMusicList',
                method: 'post',
                timeout: 30000,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                data: Obj.data,
                error: Obj ? Obj.error : null,
                success: (data, text) => {
                    if (data.list_id) {
                        AudioManager.musicLists.push({
                            name: Obj.data.name,
                            description: Obj.data.description,
                            id: data.list_id
                        })
                    }
                    if (Obj.success)
                        Obj.success(data, text)
                },
                complete: Obj ? Obj.complete : null
            });
        },

        // 修改歌单名
        changeListName: function(Obj) {
            $.ajax({
                url: server_addr + 'changeListName',
                method: 'post',
                timeout: 30000,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                data: Obj.data,
                error: Obj ? Obj.error : null,
                success: (data, text) => {
                    if (data == "ok") {
                        for (let i in AudioManager.musicLists) {
                            if (AudioManager.musicLists[i].id == Obj.data.list_id) {
                                AudioManager.musicLists[i].name = Obj.data.list_name;
                                break;
                            }
                        }
                    }
                    if (Obj.success)
                        Obj.success(data, text)
                },
                complete: Obj ? Obj.complete : null
            });
        },

        // 删除歌单
        removeList: function(Obj) {
            $.ajax({
                url: server_addr + 'removeList',
                method: 'post',
                timeout: 30000,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                data: Obj.data,
                error: Obj ? Obj.error : null,
                success: (data, text) => {
                    if (data == "ok") {
                        for (let i in AudioManager.musicLists) {
                            if (AudioManager.musicLists[i].id == Obj.data.list_id) {
                                AudioManager.musicLists.splice(i, 1);
                                break;
                            }
                        }
                    }
                    if (Obj.success)
                        Obj.success(data, text)
                },
                complete: Obj ? Obj.complete : null
            });
        },
        
        // 获取已经收藏的歌单
        getCollectLists: function(Obj)  {
            $.ajax({
                url: server_addr + 'getCollectLists',
                method: 'get',
                timeout: 30000,
                xhrFields: {
                    withCredentials: true
                },
                data: Obj.data,
                crossDomain: true,
                error: Obj ? Obj.error : null,
                success: (data, text) => {
                    if (data.name_list)
                        AudioManager.collectLists = data.name_list;
                    if (Obj && Obj.success)
                        Obj.success(data, text);
                },
                complete: Obj ? Obj.complete : null
            });
        },
        
        // 收藏歌单
        collectList: function(Obj) {
            $.ajax({
                url: server_addr + 'collectList',
                method: 'post',
                timeout: 30000,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                data: Obj.data,
                error: Obj ? Obj.error : null,
                success: (data, text) => {
                    if (data.list_id) {
                        AudioManager.collectLists.push({
                            name: Obj.data.name,
                            description: Obj.data.description,
                            id: data.list_id
                        })
                    }
                    if (Obj.success)
                        Obj.success(data, text)
                },
                complete: Obj ? Obj.complete : null
            });
        },
        
        // 取消收藏
        removeCollectList: function(Obj) {
            $.ajax({
                url: server_addr + 'removeCollectList',
                method: 'post',
                timeout: 30000,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                data: Obj.data,
                error: Obj ? Obj.error : null,
                success: (data, text) => {
                    if (data == "ok") {
                        for (let i in AudioManager.collectLists) {
                            if (AudioManager.collectLists[i].id == Obj.data.list_id) {
                                AudioManager.collectLists.splice(i, 1);
                                break;
                            }
                        }
                    }
                    if (Obj.success)
                        Obj.success(data, text)
                },
                complete: Obj ? Obj.complete : null
            });
        },

        // 添加歌曲到歌单
        addMusicToList: function(Obj) {
            $.ajax({
                url: server_addr + 'addMusicToList',
                method: 'post',
                timeout: 30000,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                data: Obj.data,
                error: Obj ? Obj.error : null,
                success: Obj ? Obj.success : null,
                complete: Obj ? Obj.complete : null
            })
        },

        // 从歌单删除歌曲
        removeSong: function(Obj) {
            if (!Obj) return;
            $.ajax({
                url: server_addr + 'removeSong',
                method: 'post',
                timeout: 30000,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                data: Obj.data,
                error: Obj ? Obj.error : null,
                success: Obj ? Obj.success : null,
                complete: Obj ? Obj.complete : null
            })
        },


        // 搜索
        searchSong: function(Obj) {
            AudioManager.NET.insertSearch_history({
                options: "local",
                data: Obj.data.search_keyword
            });
            $.ajax({
                url: server_addr + 'searchSong',
                method: 'post',
                timeout: 30000,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                data: Obj.data,
                error: Obj.error,
                success: Obj.success,
                complete: Obj.complete
            });
        },

        // 获取播放历史记录
        getPlay_history: function() {
            if ($.cookie("play_history") && $.cookie('play_history') != "")
                AudioManager.play_history = JSON.parse($.cookie("play_history"));
        },
        // 插入播放历史记录
        insertPlay_history: function(id) {
            var tmp = true;
            for (var i = 0; i < AudioManager.play_history.length; i++) {
                if (AudioManager.play_history[i] == id) {
                    tmp = false;
                    break;
                }
            }
            if (id && tmp) {
                AudioManager.play_history.unshift(id);
            }
            AudioManager.play_history.splice(20, AudioManager.play_history.length - 20);
            $.cookie("play_history", JSON.stringify(AudioManager.play_history), {
                expires: 365,
                path: '/'
            });
        },
        clearPlayHistory: function() {
            AudioManager.play_history = [];
            $.cookie("play_history", "", {
                expires: -1,
                path: '/'
            });
        },
        // 插入搜索历史记录
        insertSearch_history: function(Obj) {
            if (Obj.options == "server") {
                if ($.cookie("search_history") && $.cookie('search_history') != "")
                    AudioManager.search_history = JSON.parse($.cookie("search_history"));
                else
                    AudioManager.search_history = [];
            } else {
                for (let i = 0; i < AudioManager.search_history.length; i++) {
                    if (AudioManager.search_history[i] == Obj.data) {
                        AudioManager.search_history.splice(i, 1);
                        break;
                    }
                }
                AudioManager.search_history.unshift(Obj.data);
                AudioManager.search_history.splice(10, AudioManager.search_history.length - 10);
                $.cookie("search_history", JSON.stringify(AudioManager.search_history), {
                    expires: 365,
                    path: '/'
                });
            }
        },
        clearSearchHistory: function() {
            AudioManager.search_history = [];
            $.cookie("search_history", "", {
                expires: -1,
                path: '/'
            });
        },
        removeSearchHistory: function(search_keyword) {
            var index = AudioManager.search_history.indexOf(search_keyword);
            AudioManager.search_history.splice(index, 1);
            $.cookie("search_history", JSON.stringify(AudioManager.search_history), {
                expires: 365,
                path: '/'
            });
        }
    }
};

// 页面管理
var PageManager = {
    history: [], // 页面栈
    values: null, // 页面间传值
    valHistory: [],

    // 初始化
    _init: function() {
        PageManager.open('pages/index.html');
    },

    // 页面后退
    reBack: function() {
        console.log(PageManager.history)
        console.log(PageManager.valHistory)
        PageManager.history.pop();
        PageManager.valHistory.pop();
        
        PageManager.values = PageManager.valHistory[PageManager.valHistory.length - 1];
        $('iframe')[0].setAttribute("src", PageManager.history[PageManager.history.length - 1]);
    },

    // 打开页面
    open: function(src) {
        console.log(PageManager.history)
        console.log(PageManager.valHistory)
        if (src.includes('index')) {
            PageManager.history = ['pages/index.html'];
            PageManager.valHistory = [null];
        } else {
            PageManager.history.push(src);
            PageManager.valHistory.push(PageManager.values);
        }
        $('iframe')[0].setAttribute("src", src);
    }
}

// 其他杂七杂八的工具
var Tools = {
    // 遮罩
    mask: null,

    // 遮罩的定时关闭器
    maskTime: null,

    // 初始化
    _init: function() {
        Tools.mask = {
            show: () => {
                $("body").append("<div class='mui-backdrop'></div>");
            },
            close: () => {
                $(".mui-backdrop").remove();
            }
        };

        // 弹出式输入框的基本事件
        $("#tools-prompt *").bind(tap, () => {
            event.stopPropagation();
        });
        $("#tools-prompt").bind(tap, () => {
            event.stopPropagation();
            $("#tools-prompt").css("display", "none");
        });
    },

    // 弹窗，会有遮罩，且居中
    toast: function(text, options) {
        $("body").append("<div class='tools-toast'><p>" + text + "</p></div>");
        duration = 60 * 60 * 1000;
        if (options && options.duration) {
            if (options.duration == "long")
                duration = 3500;
            else if (typeof(options.duration) == "number")
                duration = options.duration;
        }
        setTimeout("Tools.closeToast();", duration);
    },

    // 关闭弹窗
    closeToast: function() {
        $(".tools-toast").remove();
    },

    // 输入对话框
    prompt: function(title, input, btn, callback) {
        // 填充文字
        $("#tools-prompt p").text(title);
        $("#tools-prompt-input").empty();
        input.forEach((item) => {
            $("#tools-prompt-input").append("<input placeholder=" + item + " />");
        });
        $("#tools-prompt-btn").empty();
        for (let i in btn)
            $("#tools-prompt-btn").append("<button id=" + i + ">" + btn[i] + "</button>");

        // 按钮的事件绑定
        $("#tools-prompt-btn button").bind(tap, (event) => {
            event.index = parseInt(event.currentTarget.id);
            event.vals = [];
            for (let i in input) event.vals.push($("#tools-prompt-input input")[i].value);
            if (callback)
                callback(event);
        })

        // 显示
        $("#tools-prompt").css("display", "flex");
        $("#tools-prompt-input input:first-child")[0].focus();
    },
    closePrompt: function() {
        $("#tools-prompt").css("display", "none");
    }
}

// 主页面初始化
window.onload = function() {
    mui.init();

    // 设备判断
    if (navigator.userAgent.includes("Mobile"))
        tap = 'tap';
    else
        tap = 'click';

    // 用户模块初始化
    UserManager._init();

    // 播放器初始化
    AudioManager._init();

    // 工具初始化
    Tools._init();

    // 页面初始化
    PageManager._init();


    // TODO 监听返回按键
    /* window.addEventListener("popstate", function(){
    	pageChange(pagesHistory[pagesHistory.length - 1]);
    	pagesHistory.pop()
    }, false); */
}
