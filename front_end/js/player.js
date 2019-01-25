window.onload = function() {
    mui.init({
        swipeBack: true, //启用右滑关闭功能
    });

    // 刷新一下页面
    syncPlayState();

    // 按钮事件
    $(".playing").bind(parent.tap, () => {
        if (parent.AudioManager.audio.paused) {
            parent.AudioManager.audio.play();
            $(".playing").css("background-image", "url(../resources/pause-white.svg)");
            $("#cover").css("animation-play-state", "running");
            sec_timer.start();
            word_timer.start();
        } else {
            parent.AudioManager.audio.pause();
            $(".playing").css("background-image", "url(../resources/play-white.svg)");
            $("#cover").css("animation-play-state", "paused");
            sec_timer.pause();
            word_timer.pause();
        }
    });

    $(".prev-song").bind(parent.tap, () => {
        var length = parent.AudioManager.audioList.length;
        var index = parent.AudioManager.audioIndex;
        if (index == 0)
            parent.AudioManager.setAudio(length - 1);
        else
            parent.AudioManager.setAudio(index - 1);
        parent.AudioManager.audio.play();
    });

    $(".next-song").bind(parent.tap, () => {
        var length = parent.AudioManager.audioList.length;
        var index = parent.AudioManager.audioIndex;
        if (index == length - 1)
            parent.AudioManager.setAudio(0);
        else
            parent.AudioManager.setAudio(index + 1);
        parent.AudioManager.audio.play();
    })

    $(".play-mode").bind(parent.tap, () => {
        if (parent.AudioManager.isLoop) {
            parent.AudioManager.isLoop = false;
            $(".play-mode").css("background-image", "url(../resources/order.png)");
        } else {
            parent.AudioManager.isLoop = true;
            $(".play-mode").css("background-image", "url(../resources/repeat.svg)");
        }
    });

    $(".music-queue").bind(parent.tap, () => {
        mui("#play-queue").popover('show')
    });

    // 播放列表
    $("#play-queue ul").empty();
    parent.AudioManager.audioList.forEach((item, index) => {
        $("#play-queue ul").append("<li class='mui-table-view-cell' id=" + index + ">" + item.song_name +
            "</li>")
    });

    $("#play-queue li").bind(parent.tap, (event) => {
        parent.AudioManager.setAudio(parseInt(event.currentTarget.id));
        parent.AudioManager.audio.play();
        mui("#play-queue").popover('hide');
    })

    $("#play-queue button").bind(parent.tap, () => {
        parent.AudioManager.setAudioList([]);
        parent.AudioManager.setAudio(-1);
        parent.PageManager.reBack();
    })

    // 页面跳转
    $('.nav-back').bind(parent.tap, () => {
        parent.parent.PageManager.reBack();
    });
}

// 播放结束时，在AudioManager里面会调用
function audio_onEnd() {
    $("#cover").css("animation-play-state", "paused");
    $("#start-time").text("00:00");
    $("#sub-progress").css("width", "0px");
}

function audio_onPlay() {}

function audio_onCanplay() {
    syncPlayState();
}

function syncPlayState() {
    // 歌曲信息
    var song = parent.AudioManager.audioList[parent.AudioManager.audioIndex];
    $(".mui-title").text(song.song_name);
    $("#singer").text(song.singer_name);
    $("#cover").css("background-image", "url(" + song.song_img + ")");
    $("#cover").css("animation-play-state", "running");
    var duration = parseStamp(parent.AudioManager.audio.duration * 1000);
    $("#end-time").text(duration.min + ":" + duration.sec);

    // 歌词
    setLyric(song.song_words);

    // 按钮条
    if (parent.AudioManager.audio.paused) {
        $(".playing").css("background-image", "url(../resources/play-white.svg)");
        $("#cover").css("animation-play-state", "paused");
    } else {
        $(".playing").css("background-image", "url(../resources/pause-white.svg)");
        $("#cover").css("animation-play-state", "running");
    }
    if (parent.AudioManager.isLoop) {
        $(".play-mode").css("background-image", "url(../resources/repeat.svg)");
    } else {
        $(".play-mode").css("background-image", "url(../resources/order.png)");
    }

    if (!parent.AudioManager.audio.paused) {
        sec_timer.start();
        word_timer.start();
    }
}

var sec_timer = {
    timer: null,
    start: () => {
        if (sec_timer.timer != null)
            clearTimeout(sec_timer.timer)
        var timer_fun = () => {
            var duration = parent.AudioManager.audio.duration * 1000;
            var currentTime = Math.floor(parent.AudioManager.audio.currentTime * 1000);
            var crnTimeParsed = parseStamp(currentTime);
            $("#start-time").text(crnTimeParsed.min + ":" + crnTimeParsed.sec);
            $("#sub-progress").css("width", (currentTime / duration * 100) + "%");
            if (currentTime >= duration) return;
            sec_timer.timer = setTimeout(timer_fun, 1000);
        }
        timer_fun();
    },
    pause: () => {
        clearTimeout(sec_timer.timer)
    }
}

function parseStamp(msecStamp) {
    var min = Math.floor(msecStamp / 60000);
    var sec = Math.floor((msecStamp - (min * 60000)) / 1000);
    if (min < 10) min = "0" + min;
    if (sec < 10) sec = "0" + sec;
    return {
        min: min,
        sec: sec
    }
}

function setLyric(lyric) {
    var rows = lyric.split("\n");
    var prt = /\[[0-9]{2}\:[0-9]{2}\.[0-9]{2}\]/;
    $(".lyric ul").empty();
    word_timer.word_rows = [];
    word_timer.index = 0;
    for (let i = 0; i < rows.length; i++) {
        if (prt.test(rows[i])) {
            var rlt = prt.exec(rows[i]);
            var text = rows[i].slice(rlt.index + 10, rows[i].length);
            word_timer.word_rows.push({
                time: _timeStamp(rlt[0]),
                text: text
            });
            $(".lyric ul").append("<li>" + text + "</li>");
        }
    }
}

var word_timer = {
    timer: null,
    word_rows: [],
    index: 0,
    start: () => {
        if (word_timer.timer != null)
            clearTimeout(word_timer.timer)

        // 确定一下index
        var currentTime = parent.AudioManager.audio.currentTime * 1000;
        var searchStart = 0;
        if (word_timer.index < word_timer.word_rows.length &&
            word_timer.word_rows[word_timer.index].time <= currentTime) {
            searchStart = word_timer.index;
        }
        for (let i = searchStart; i < word_timer.word_rows.length; i++) {
            if (i == word_timer.word_rows.length - 1) {
                word_timer.index = i + 1;
            } else if (word_timer.word_rows[i].time > currentTime) {
                word_timer.index = i;
                break;
            } else if (word_timer.word_rows[i].time <= currentTime &&
                currentTime < word_timer.word_rows[i + 1].time) {
                word_timer.index = i;
                break;
            }
        }

        var timer_fun = () => {
            $(".lyric ul").css("transform", " translate(0,-" + (word_timer.index * 25) + "px)");
            if ($(".lyric li.active").length != 0) $(".lyric li.active").removeClass("active");
            if (word_timer.index < word_timer.word_rows.length - 1) {
                $(".lyric li")[word_timer.index].className = "active";
                word_timer.index++;
                word_timer.timer = setTimeout(timer_fun,
                    word_timer.word_rows[word_timer.index].time - parent.AudioManager.audio.currentTime *
                    1000);
            }
        }
        timer_fun();
    },
    pause: () => {
        clearTimeout(word_timer.timer);
    }
}

function _timeStamp(time_str) {
    var min = parseInt(time_str.slice(1, 3));
    var sec = parseInt(time_str.slice(4, 6));
    var msec = parseInt(time_str.slice(7, 9));
    return min * 60 * 1000 + sec * 1000 + msec;
}
