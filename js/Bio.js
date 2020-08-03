'use strict';

var video = window.video = document.querySelector('video');
var canvas = document.getElementById("canvas_jpg");


var timeoutId = 0;
var sessionid = _uuid();
var serialno = 0;
var rspserialno = 0;





var LoopIsContinue = true;
var gFPS = 30;      //這個有必要嗎???要測試~~
var gclearCountTimeOut = 3000;  //毫秒
var gReconnectTime = 30;        //秒
var gDetectOkSleepTIme = 5000;  //毫秒

var ShotTime = {
    Start: "",
    End: "",
    diff: 0,
}

var resetCount = function () {
    this.clockStart = function () {
        if (this.ClockIsStart == false) {
            this.ClockIsStart = true;
            this.ClockID = setTimeout(() => {
                this.ClockIsStart = false;
            }, gclearCountTimeOut);
        }
    }
    this.clockReset = function () {
        if (this.ClockIsStart == true) {
            this.ClockIsStart = false;
            clearTimeout(this.ClockID);
        }
    }
};

resetCount.prototype = {
    ClockID: false,
    ClockIsStart: false,
};

var gresetCount = new resetCount();

// autoverify.onclick = function () {

//     LoopIsContinue = LoopIsContinue == true ? false : true;

//     if (LoopIsContinue == true) {
//         document.getElementById("autoverify").innerText = "stop";
//     }
//     else {
//         document.getElementById("autoverify").innerText = "autoverify";
//     }
// };


async function snapshot() {

    if (video.videoWidth > video.videoHeight) {

        canvas.width = 320;
        canvas.height = 240;
    }
    else {

        canvas.width = 240;
        canvas.height = 320;
    }

    await canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, canvas.width, canvas.height);


    sendImageBySocket();
    return '0';
}


function reset() {
    gresetCount.clockStart();
    document.getElementById("content").innerHTML = "";
}



function sendImageBySocket() {
    var img        = canvas.toDataURL();
    var imgLength = img.length;
    var img64      = img.replace(/^data:image\/(png|jpg);base64,/,"")
    var img64Length = img64.length;
    var binary_img = atob(img64);
    var buf_size   = sessionid.length * 2 + 8 + binary_img.length;
    var pad_zero   = buf_size % 32;
    buf_size += 32 - pad_zero;

    var buffer = new ArrayBuffer(buf_size);
    var bytes  = new Uint8Array(buffer);
    serialno++;

    var epos = str2ab(sessionid, buffer, 0);
    epos = int2ab(serialno, buffer, epos);
    epos = int2ab(binary_img.length, buffer, epos);
    
    for (var i = 0; i < binary_img.length; i++) {
        bytes[i + epos] = binary_img.charCodeAt(i);
    }

    var bufferLength = buffer.length;



    // ws.send(buffer);
    // if (ws.bufferedAmount === 0) {
    //     //document.getElementById("debugWebSocketConsole").innerHTML = "Send finish." + "</a><br>";
    // } else {
    //     //document.getElementById("debugWebSocketConsole").innerHTML = "Wait." + "</a><br>";
    // }
}


function _uuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4();
    //return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function str2ab(str, buf, buf_fpos) {
    var bufView = new Uint16Array(buf);
    var fpos = buf_fpos / 2;
    for (var i=0; i < str.length; i++) {
        bufView[i + fpos] = str.charCodeAt(i);
    }
    return buf_fpos + str.length * 2;
}

function int2ab(num, buf, buf_fpos) {
    var bufView = new Uint32Array(buf);
    var fpos = buf_fpos / 4;
    bufView[fpos] = num;
    return buf_fpos + 4;
}





async function callme() {

    
        snapshot();

        // ShotTime.Start = new Date();

    // snapshot();

    // var canvasData = canvas.toDataURL("image/jpeg");
    // worker.postMessage(canvasData);
}


window.onbeforeunload = function () {

    video.pause(); video.src = ""; //chrome
};

window.onload = async function () {

    // await delay(1000);

    ShotTime.Start = new Date();
    ShotTime.End = new Date();

    Main();
}

async function Main()
{
        await delay(30);
        waitExecute(callme, 500);
        Main();
}


var count = 0;



function InvernalServerError() {
    document.getElementById("content").innerHTML = gReconnectTime - count + "s</a><br>";
    count = count + 1;

    if (count <= gReconnectTime) {

        gresetCount.clockReset();
        setTimeout("InvernalServerError()", 1000)
    }
    else {
        count = 0;
        document.getElementById("content").innerHTML = "";
        callme();
    }
}

function ShowResult(_testResult) {

    var errorCode = new Number(0);

    document.getElementById("content").style.fontSize = "36px";

    switch (_testResult.Result) {
        case FaceResultEnum.ok.STRING:

            document.getElementById("content").innerHTML = "Welcome : " + _testResult.Content;
            gresetCount.clockReset();
            errorCode = 2;
            break;

        case FaceResultEnum.error.STRING:
        case FaceResultEnum.faceNotFound.STRING:
        case FaceResultEnum.unknownface.STRING:

        // document.getElementById("content").innerHTML = "Waiting face!!";
            errorCode = 1;
            reset();
            break;

        case FaceResultEnum.Exception.STRING:

        // document.getElementById("content").innerHTML = _testResult.Result;
            errorCode = 0;
            break;

        case FaceResultEnum.InternalServerError.STRING:

        errorCode = 6;

        case FaceResultEnum.UserUnDefine.STRING:

        // document.getElementById("content").innerHTML = _testResult.Result;
        errorCode = 7;
        break;

        case FaceResultEnum.JsonParseFail.STRING:

        // document.getElementById("content").innerHTML = _testResult.Result;
        errorCode = 8;
        break;

        case FaceResultEnum.HttpReceiveFail.STRING:

        // alert("發生HttpError，重創HTTP object");
        // XMLInit();
        // document.getElementById("content").innerHTML = _testResult.Result;
        errorCode = 9;
        break;
    }
    return errorCode;
}



async function TimeOut(_time) {
    return await delay(_time);
}

async function delay(duration) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    });
}

Promise.delay = function (t, val) {
    return new Promise(resolve => {
        setTimeout(resolve.bind(null, val), t);
    });
}

Promise.raceAll = function (promises, timeoutTime, timeoutVal) {
    return Promise.all(promises.map(p => {
        return Promise.race([p, Promise.delay(timeoutTime, timeoutVal)])
    }));
}



function waitExecute(proc, chkInterval) {

    var x = chkInterval || 500;

    if (LoopIsContinue) {
        proc();
    }
    else {
        var hnd = window.setInterval(function () {

            if (LoopIsContinue) {
                proc();
                window.clearInterval(hnd);
            }
        }, x);
    }
}


var constraints = {
    audio: false,
    video: { width: { min: 320, max: 640, fameRate: { ideal: 5, max: 5 } } }
    //video: { width: { min: 320, max: 640 }, facingMode: { exact: "environment" } }
};

function handleSuccess(stream) {
    window.stream = stream;
    video.srcObject = stream;
}

function handleError(error) {
    console.log('navigator.getUserMedia error: ', error);
}



navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess);


