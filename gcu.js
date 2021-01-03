// ==UserScript==
// @name         niwho_gcu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://jwxt.gcu.edu.cn/js_main.aspx?xh=2020081
// @grant        GM_addStyle
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.min.js
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

function parse_input(raw_data){
    var ret = {};
    //let raw_data = $('#wt_text').val();
    // 解析
    let rows = raw_data.split('\n').filter(item=>item);
    for(let row of rows){
        let a = row.split(/[,\ ]/).filter(item=>item)
        //格式： 姓名 平时成绩 期末成绩
        ret[a[0]] = a.slice(1);//[a[1], a[2]];
    }
    return ret;
}

function parse_input_common(raw_data){
    var ret = [];
    //let raw_data = $('#wt_text').val();
    // 解析
    let rows = raw_data.split('\n').filter(item=>item);
    for(let row of rows){
        let a = row.split(/[,\ ]/).filter(item=>item)
        //格式： 姓名 平时成绩 期末成绩
        //ret[a[0]] = a.slice(1);//[a[1], a[2]];
        if (a.length>0){
            ret.push(a)
        }

    }
    return ret;
}

// 填充成绩
function fill_data(){
    var el_btn = $('button#wt_btn2')
    el_btn.click(function(){
        let raw_data = $('#wt_text').val();
        let input_data = parse_input(raw_data);
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

var wb;//读取完成的数据


function importf(obj) {//导入

    if(!obj.files) {
        return;
    }
    var f = obj.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = e.target.result;

        wb = XLSX.read(data, {
            type: 'binary'
        });

        //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
        //wb.Sheets[Sheet名]获取第一个Sheet的数据
        let jsond = JSON.stringify( XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) );
        let csvd =  XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
        console.log(jsond);
        console.log(csvd);
        let pd = parse_input_common(csvd);
        console.log(pd);
        $('#wt_text').val(pd[10]);
        let table = create_table(pd);
        $("div#data").append(table);
        $("div#data").show();
    };

    reader.readAsBinaryString(f);

}

function input_excel(){
    let input_el = $("input#file_id");
    console.log(input_el);
    input_el.on("change", null, function(e){
        importf(e.target);
    });
}

function setup_close() {
    let el = $("button#close");
    let input_el = $("input#file_id");
    el.click(function(){
        $("div#data").hide();
        $("div#data>table").remove();
        input_el.val("");

    })
}

function make_talbe_header(tbody, num){
    // 头部选项 姓名 平时成绩 期中成绩 期末成绩
    let select = `<select>
  <option value =" "> </option>
  <option value ="姓名">姓名</option>
  <option value ="平时成绩">平时成绩</option>
  <option value="期中成绩">期中成绩</option>
  <option value="期末成绩">期末成绩</option>
  <option value="实验成绩">实验成绩</option>
  </select>`;
    $('tr#header').remove();
    let tr = $('<tr id="header"><td/></tr>');
    for(let i=0;i<num;i++){
        let el = $(`<td>${select}</td>`);
        tr.append(el);
    }
    //let tbody = $("tbody");
    console.log("1111", tbody);
    tbody.prepend(tr);
    return tr;
}

function create_table(rows){
    let table = $('<table><tbody>  </tbody></table>')
    let tbody = $(table.find("tbody"))
    console.log(rows);

    // 构造tr
    let max_num = 0;
    for(let row of rows){
        if(row.length>max_num){
            max_num = row.length;
        }
        let tr = $('<tr></tr>');
        tr.append(`<td><button id="id_del">删除</button></td>`)
        $(tr.find("button#id_del")).click(function(e){
            let el = $(e.target).parent().parent();
            console.log(el);
            el.remove();
        })
        for (let col of row){
            tr.append(`<td>${col}</td>`)
            //console.log(col,tr.text())
        }
        tbody.append(tr)
    }
    make_talbe_header(tbody, max_num);
    console.log(tbody);
    return table;
}

function parse_result_talbe(){
    let tbody = $('#data > table > tbody');
    let childs = tbody.children();
    console.log(childs[0], childs[1]);
    let header = childs[0];
    // 获取header的设置
    var opt = {};
    try {
        opt = parse_header(header);
    } catch (e) {
        alert(e.name + ": " + e.message);
        //结束执行
        return
    }
    let dc = childs.splice(1);

    let filling = {};

    for(let item of dc){
        let subs = $(item).children();
        let entrys={};
        let person="";
        for (let name in opt){
            if (opt.hasOwnProperty(name) === true){
                let valx = $(subs[opt[name]['origin']]).text();
                //console.log("valx", valx);
                if (name=="姓名"){
                    person = valx
                }else {
                    valx = valx.trim();
                    if (valx!="" && isNumber(valx)){
                        //console.log(valx, valx)
                        entrys[opt[name]['target']] = valx;
                    }

                }
            }
        }
        if(Object.keys(entrys).length>0){
            filling[person] = entrys;
        }

        //console.log(person, entrys);
    }
    return filling;
}

function isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    //var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val)){ //|| regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
}

function parse_header(header){
    let idx = -1;
    let chlds = $(header).children()
    var opt = {}
    for(let item of chlds){
        idx += 1;
        let v = $($(item).find('select')).val();
        if(v==undefined || v.trim()==""){
            continue;
        }
        console.log(idx, v);
        if(opt[v]!=undefined){
            //alert("选项重复", v);
            throw new Error("选项重复："+ v);
        }
        opt[v]=idx;
        switch(v){
            case "姓名":
                opt[v] = {"origin": idx, "target": -1}; //姓名不需要设置
                break;
            case "平时成绩":
                opt[v] = {"origin": idx, "target": 3};
                break;
            case "期中成绩":
                opt[v] = {"origin": idx, "target": 4};
                break;
            case "期末成绩":
                opt[v] = {"origin": idx, "target": 5};
                break;
            case "实验成绩":
                opt[v] = {"origin": idx, "target": 6};
                break;
        }
    }
    /*
   <option value ="姓名">姓名</option>
  <option value ="平时成绩">平时成绩</option>
  <option value="期中成绩">期中成绩</option>
  <option value="期末成绩">期末成绩</option>
  <option value="实验成绩">实验成绩</option>
   */
    // 姓名 必须有
    if (opt['姓名']==undefined){
        throw new Error("[姓名]必须设置");
    }
    return opt;
}


function setup_btn_fill(){
    let el = $('button#wt_btn_fill');
    el.click(function(){

        // 解析表格数据
        let filling = parse_result_talbe();
        console.log("%%%%%%%", filling);
        let html_data = parse_data();
        for(let name in filling){
            if (filling.hasOwnProperty(name) === true){

                let item = html_data[name];

                if (item==undefined){
                    continue;
                }
                let entry = filling[name];
                //console.log("11111", name, item, entry)
                for (let idx in entry){
                    if (entry.hasOwnProperty(idx) === true){
                        let el = $(item.find(`td:eq(${idx})>input`));
                        console.log("#####", el)
                        el.val(entry[idx]);
                    }
                }

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
    GM_addStyle('#data { position:absolute;top:0px;left:0px;z-index:99999;width:100%;height:100%;background-color:#ffe; filter:alpha(opacity=50);}');
    GM_addStyle('.block {display: block}')
    GM_addStyle('#wt_text {height: 100px}')
    GM_addStyle('table,tr,td {border: 1px solid #ccc;border-collapse: collapse;}')
    //GM_addStyle('#wt_text {height: 100px}')
    // Your code here...
    var el = $('<div id="wt"><button id="wt_btn1" class="block" style="right:100px;" >展开</button><div id="wt_area" style="display:none;"><textarea id="wt_text" class="block">'+
               '</textarea><input id="file_id" type="file" class="block"><button id="wt_btn2" >填充</button><span>  </span><button id="wt_btn3" >获取</button><span>  </span><button id="wt_btn_pwd" >密码</button></div></div>'+
               '<div id="data" style="display:none;overflow:scroll;"><button id="close">关闭</button><span>  </span><button id="wt_btn_fill" >填充</button><div>');
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
    input_excel();
    setup_close();
    setup_btn_fill();

})();
