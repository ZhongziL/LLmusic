window.onload = function() {
    mui.init({
        swipeBack: false
    });
    mui('.mui-scroll-wrapper').scroll();

    $('.nav-back').bind('click', parent.PageManager.reBack);
    var list = [];

    if (parent.PageManager.values.targer == "focus") {
        $("h1.mui-title").text("关注");
        list = parent.PageManager.values.focus_list
    } else {
        $("h1.mui-title").text("粉丝");
        list = parent.PageManager.values.fans_list
    }

    $("ul").empty();
    for (var i = 0; i < list.length; i++) {
        $("ul").append(
            '<li class="mui-table-view-cell mui-media" id=' + i + '>' +
            '    <div class="mui-media-body">' + list[i] + '</div>' +
            '</li>'
        );
    }

    $("li").bind(parent.tap, (event) => {
        parent.PageManager.values = {
            username: $(event.currentTarget).find("div")[0].textContent
        };
        parent.PageManager.open("pages/personalCenter.html");
    });
}
