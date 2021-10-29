// ==UserScript==
// @name         douyu danmu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.douyu.com/*
// @icon         https://www.google.com/s2/favicons?domain=douyu.com
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/gsap/3.8.0/gsap.min.js
// ==/UserScript==
var turn_danmu = true;

function clear_ui() {

    $('#js-room-activity').remove();
   $('.Title-col.is-right.h34').remove();
    $('.wm-view').css({"display": "none"});
    $('#js-player-toolbar').remove();

}

function hidden_origin_danmu(){
    console.log('########################', $('.comment-37342a'), $('.comment-37342a').addClass);
    $('#comment-higher-container').remove();

}

function display_damu(content, player){
    var el = $('<div></div>').text(content.text);
    let height = Number(Math.random() * 80).toFixed(1) + "%";
    el.css({"position":"absolute", "left":-2*el.outerWidth(), "top":height, "z-index":1000, "color": "white","font-size": "18px", "font-weight": "blod"});
    player.append(el)
    gsap.set(el, {x:player.outerWidth()+el.outerWidth()})
    var t = gsap.timeline({});
    t.to(el, {x: -player.outerWidth()-2*el.outerWidth(), duration: 10*player.outerWidth()/500, ease: "none",onComplete:function(){
        el.remove();
    }});
    el.hover(function() { t.pause(); }, function() { t.resume(); });
    //console.log(el.outerWidth(), player.outerWidth())

}

function get_danmu(){
    'use strict';
    // 选择需要观察变动的节点
    const targetNode = document.getElementsByClassName('Barrage-list')[0];
    console.log("######", targetNode)

    // 观察器的配置（需要观察什么变动）
    const config = { attributes: true, childList: true, subtree: true };

    // 当观察到变动时执行的回调函数
    const callback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                //console.log('A child node has been added or removed.', mutation.addedNodes);
                for(let node of mutation.addedNodes) {
                    //console.log("11111111111111111 ", node, "222222")
                    //print_attr_methods(node)
                    const vn = $(node).children("div");
                    // level
                    var level = vn.children('span.js-user-level').attr("title");
                    level = parseInt(level.split('：')[1])
                    // nickname
                    const nickname = vn.children('span.Barrage-nickName').attr("title");

                    const uid = Number(vn.children('span.Barrage-nickName').attr("data-uid"));
                    // text
                    const text = vn.children('span.Barrage-content').text().trim();
                    const danmu = {"level": level,"uid": uid, 'nickname': nickname, 'text': text};
                    // console.log(danmu);
                    //console.log($('#__h5player'), $('#__h5player').clientWidth)
                    if (turn_danmu ) {
                        display_damu(danmu, $('#__h5player'));
                    }
                }
            }
            else if (mutation.type === 'attributes') {
                //console.log('The ' + mutation.attributeName + ' attribute was modified.');
            }
        }
    };

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);

    // 以上述配置开始观察目标节点
    observer.observe(targetNode, config);

    // 之后，可停止观察
    //observer.disconnect();
    // Your code here...
    console.log("my monitor start");

    hidden_origin_danmu();
    clear_ui();
}

function print_attr_methods(obj) {
    'use strict';
    // 获取对象方法
    for (var i in obj) {
        if (obj.hasOwnProperty(i) ) {
            if (typeof obj[i] == "function") {
                console.log("对象方法: ", i, "=", obj[i])
            }
            else if ( typeof obj[i] != "function"){
                console.log("对象属性: ", i);
            }

        }
    }

}

(function() {
    'use strict';
    var checkExist = setInterval(function() {
        if ( document.getElementsByClassName('Barrage-list').length) {
            console.log("Exists!");

            clearInterval(checkExist);

            get_danmu();
        }
    }, 1000); // check every 100ms


    document.addEventListener("visibilitychange", function() {
        console.log(document.visibilityState);
        if(document.visibilityState == "hidden") {
            console.log('隐藏');
            turn_danmu = false;
        } else if (document.visibilityState == "visible") {
            console.log('显示');
            turn_danmu = true;
        }
    });


})();