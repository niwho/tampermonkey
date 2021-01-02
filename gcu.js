// ==UserScript==
// @name         niwho_gcu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://jwxt.gcu.edu.cn/js_main.aspx
// @grant        GM_addStyle
// @require https://code.jquery.com/jquery-3.5.1.min.js

// ==/UserScript==

function autopasswd(){
    $(':button').click(function(e){
        console.log(e)
    })
}

function button_get(){
    var el_btn_get = $('button#wt_btn3')

    el_btn_get.click(function(){
        var data = parse_data();
        var str = "";
        for( let key in data ){
            if (data.hasOwnProperty(key) === true){
                //console.log(key);

                // console.log( data[key].find("td:eq(3)"));
                let darly_score =  $(data[key].find("td:eq(3)>input")).val();
                let final_score = $(data[key].find("td:eq(5)>input")).val();
                //break;
                str += `${key}, ${darly_score}, ${final_score}\n`;
            }
        }
        console.log(str)
        $('#wt_text').val(str)

    })
}

function button_pwd(){
    var el_btn = $('button#wt_btn_pwd')
    el_btn.click(function(){
        $($("#frame_content").contents().find("input[type=password]")).val(window.localStorage.getItem("gcu_passwd"));

        $($("#frame_content").contents().find("#Button1")).click();
    })
}

function parse_data(){
    var ret = Object();
    var rows =  $($("#frame_content").contents().find("#DataGrid1 > tbody>tr:first")).nextAll()
    for(var item of rows)
    {
        var name = $($(item).find("td:eq(2)")).text();
        ret[name] = $(item);
    }
    return ret;
}

function parse_input(){
    var ret = {};
    let raw_data = $('#wt_text').val();
    // 解析
    let rows = raw_data.split('\n').filter(item=>item);
    for(let row of rows){
        let a = row.split(/[,\ ]/).filter(item=>item)
        //格式： 姓名 平时成绩 期末成绩
        ret[a[0]] = [a[1], a[2]];
    }
    return ret;
}

// 填充成绩
function fill_data(){
    var el_btn = $('button#wt_btn2')
    el_btn.click(function(){
        let input_data = parse_input();
        //console.log(input_data);
        let html_data = parse_data();
        for(let name in input_data){
            if (input_data.hasOwnProperty(name) === true){
                let item = html_data[name];
                if (item==undefined){
                    continue;
                }
                $(item.find("td:eq(3)>input")).val(input_data[name][0]);
                $(item.find("td:eq(5)>input")).val(input_data[name][1]);
            }
        }
    })

}

//$($("#frame_content").contents().find("input[type=password]")).val(111111222)
// $($("#frame_content").contents().find("#TextBox1")).val(111111222)
//$($("#frame_content").contents().find("input[type=password]")).val(111111222)

(function() {
    'use strict';
    autopasswd();
    GM_addStyle('#wt { position:fixed;top:100px;right:100px;z-index:9999; }');
    GM_addStyle('.block {display: block}')
    GM_addStyle('#wt_text {height: 100px}')
    //GM_addStyle('#wt_text {height: 100px}')
    // Your code here...
    var el = $('<div id="wt"><button id="wt_btn1" class="block" style="right:100px;" >展开</button><div id="wt_area" style="display:none;"><textarea id="wt_text" class="block">'+
               '</textarea><button id="wt_btn2" >填充</button><span>  </span><button id="wt_btn3" >获取</button><span>  </span><button id="wt_btn_pwd" >密码</button></div></div>');
    $('body').append(el)
    var el_btn = $('button#wt_btn1')
    console.log(el_btn)
    el_btn.click(function(){
        var btn_text = el_btn.text();

        if(btn_text=="展开"){
            el_btn.text("收起");
            $('div#wt_area').show();
        }else{
            el_btn.text("展开");
            $('div#wt_area').hide();
        }

    });
    // $(window.frames["frame_content"].document).find(":text");
    // $(window.parent.document).find(":text");
    button_get();
    button_pwd();
    fill_data();

})();