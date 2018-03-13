// Example clipboard:
// 石头 collected!
// or
// 苹果 collected!

var c2tts = {
    translateAndPlay: function(ttsMessageText) {
        window.location = "https://translate.google.com/m/translate#zh-CN/en/" + encodeURIComponent(ttsMessageText);

        setTimeout(function() {
            playTargetLanguage(ttsMessageText);
        }, 400);

        setTimeout(function() {
            playSourceLanguage(ttsMessageText);
        }, 2500);
    },

    playSourceLanguage: function(ttsMessageText) {
        setTimeout(function() {
            var mouseDown = document.createEvent("MouseEvents");
            mouseDown.initEvent("mousedown", true, true);
            document.getElementsByClassName("src-tts")[0].dispatchEvent(mouseDown);

            var mouseUp = document.createEvent("MouseEvents");
            mouseUp.initEvent("mouseup", true, true);
            document.getElementsByClassName("src-tts")[0].dispatchEvent(mouseUp);
        }, 200);
    },

    playTargetLanguage: function(ttsMessageText) {
        setTimeout(function() {
            var mouseDown = document.createEvent("MouseEvents");
            mouseDown.initEvent("mousedown", true, true);
            document.getElementsByClassName("res-tts")[0].dispatchEvent(mouseDown);

            var mouseUp = document.createEvent("MouseEvents");
            mouseUp.initEvent("mouseup", true, true);
            document.getElementsByClassName("res-tts")[0].dispatchEvent(mouseUp);
        }, 200);
    }
}

cbParser = {
    getCheckAndTransformedCollectedMessage: function(clipboard) {
        if (isCollectedMessage(clipboard)) {
            return transformCollectedMessage(clipboard);
        } else {
            return clipboard;
        }
    },

    isCollectedMessage: function(text) {
        return text.indexOf(' collected!') !== -1
    },

    transformCollectedMessage: function(collectedClipboard) {
        return collectedClipboard.replace(' collected!', '') + '收集！';
    }
}

var remainingPauseTime = 0;
var clipboard = window.clipboardData.getData('Text');

setInterval(function() {
    var curCb = window.clipboardData.getData('Text');
    remainingPauseTime = Math.max(remainingPauseTime - 200, 0);

    if (remainingPauseTime == 0 && clipboard != curCb && isCollectedMessage(curCb)) {
        remainingPauseTime = 5000;
        clipboard = window.clipboardData.getData('Text');
        console.log('new clipboard text: ' + clipboard);
        var ttsMessage = getCheckAndTransformedCollectedMessage(clipboard);
        console.log('new ttsMessage: ' + ttsMessage);

        c2tts.translateAndPlay(ttsMessage);
    }
}, 50);