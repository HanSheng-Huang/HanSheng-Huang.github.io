'use strict';
var version = "v 1.0";

const getNode = query => document.querySelector(query);
const getNewCardNode = (node => () => document.importNode(node, true))(getNode('#template'));


const writeDataToNode = (node, image, data) => {
    var _img = node.content.querySelector('#img');
    var _txt = node.content.querySelector('#txt');
    var _enroll = node.content.querySelector('#btnenroll');
    var _modify = node.content.querySelector('#btnmodify');
    var _btndelete = node.content.querySelector('#btndelete');
    var _btndetail = node.content.querySelector('#btnDetail');

    _img.src = `data:image/jpg;base64,${image}`;
    _enroll.onclick = function () {

        var nickname = prompt("請輸入名稱", "");
        if (nickname != null) {
            var tmp = '/users.cgi?cmd=enroll&uuid=' + data.uuid + '&username=' + nickname;
            Send(tmp);
            _txt.innerHTML = nickname;
        }
    };

    _modify.onclick = function () {

        var nickname = prompt("請輸入名稱", "");
        if (nickname != null) {
            var tmp = '/users.cgi?cmd=update&pid=' + data.pid + '&username=' + nickname;
            Send(tmp);
            Send("/users.cgi?cmd=facesenrolllist");
        }
    };

    _btndelete.onclick = function () {

        var answer = confirm('Are you sure you want to delete this?');
        if (answer) {
            var tmp = '/users.cgi?cmd=delete&pid=' + data.pid;
            Send(tmp);
            Send("/users.cgi?cmd=facesenrolllist");
        }
    };

    _btndetail.onclick = function () {

            var tmp = '/users.json?pid=' + data.pid;
            Send(tmp);
    };

    if (data.username == "") {
        _txt.innerText = "unknown";
    } else {
        _txt.innerText = data.username;
    }
    return node;
};





function Show(cmd, count, data) {

    var container = getNode('div.people');
    container.innerHTML = "";
    let newNode;
    let tmpNode;

    for (var i = 0; i < count; i++) {
        switch (cmd) {
            case "/users.cgi?cmd=facesenrolllist":

                tmpNode = getNewCardNode();
                tmpNode.content.querySelector('#btnenroll').style.visibility = 'hidden';
                tmpNode.content.querySelector('#btnDetail').style.visibility = 'hidden';
                newNode = writeDataToNode(tmpNode, data.faces[i].img[0].img, data.faces[i]);
                break;
            case "/users.cgi?cmd=faceslivelist":

                if (data.faces[i].img == "" && data.faces[i].username == "") break;
                tmpNode = getNewCardNode();
                tmpNode.content.querySelector('#btnmodify').style.visibility = 'hidden';
                tmpNode.content.querySelector('#btndelete').style.visibility = 'hidden';
                tmpNode.content.querySelector('#btnDetail').style.visibility = 'hidden';
                if (data.faces[i].img == "") {
                    newNode = writeDataToNode(tmpNode, data.faces[i].img, data.faces[i]);
                } else {
                    newNode = writeDataToNode(tmpNode, data.faces[i].img, data.faces[i]);
                }
                break;

            default:

                break;
        }


        if (newNode)
            container.prepend(newNode.content);
    }
}

//cmd 事件
$("#enrollfaceslist").click(function () {

    Send("/users.cgi?cmd=facesenrolllist");
});

$("#livefaceslist").click(function () {

    Send("/users.cgi?cmd=faceslivelist");
});

$("#modebio").click(function () {

    Send("/sys.cgi?cmd=biomode");
});

$("#modeenroll").click(function () {

    Send("/sys.cgi?cmd=enrollmode");
});


$(function() {
    $("#about").on("click",function() {
        swal({
            title: "Version",
            text: version,
            icon: "success",
            button: "OK",
          });
    });
  });


function Send(cmd) {
    $.ajax({
        // url: self.location.origin + cmd, //請求的url地址
        url:"http://192.168.88.100:8080"+cmd,
        dataType: "json", //返回格式為json
        async: true, //請求是否非同步，預設為非同步，這也是ajax重要特性
        // data: { "id": "value" }, //引數值
        type: "GET", //請求方式
        timeout: 5000,
        beforeSend: function () {
            //請求前的處理
        },
        success: function (req) {
            //請求成功時處理
            Analyze(req, cmd);
        },
        complete: function () {
            //請求完成的處理
        },
        error: function () {
            //請求出錯處理
        }
    });
}

function Analyze(data, cmd) {

    document.getElementById("p1").innerHTML = data.msg;
    switch (cmd) {

        case "/users.cgi?cmd=facesenrolllist":
        case "/users.cgi?cmd=faceslivelist":
            Show(cmd, data.faces.length, data);
            break;

        default:
            break;
    }
}