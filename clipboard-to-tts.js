// Example clipboard:
// c2tts{石头 used!} c2tts{苹果 collected!}

var c2tts = {

    ready: true,
    firstAudioFinished: false,

    isAudioPlaying: function() {
        // console.log('isAudioPlaying');
        var srcBtn = document.getElementsByClassName("src-tts")[0];
        var resBtn = document.getElementsByClassName("res-tts")[0];
        return srcBtn.classList.contains('jfk-button-checked') ||
            resBtn.classList.contains('jfk-button-checked');
    },

    translateAndPlay: function(ttsMessageText) {
        c2tts.ready = false;
        console.log('translateAndPlay:' + ttsMessageText);
        window.location = "https://translate.google.com/m/translate#zh-CN/en/" + encodeURIComponent(ttsMessageText);

        // TODO: play when button ready
        setTimeout(function() {
            c2tts.playTargetLanguage(ttsMessageText);
            c2tts.firstAudioFinished = true;
        }, 400);

        var secondSoundInterval = setInterval(function() {
            if (!c2tts.isAudioPlaying() && c2tts.firstAudioFinished) {
                clearInterval(secondSoundInterval);
                c2tts.firstAudioFinished = false;
                c2tts.playSourceLanguage(ttsMessageText);
                c2tts.setReadyWhenFinished();
            }
        }, 50);
    },

    playSourceLanguage: function(ttsMessageText) {
        console.log('playSourceLanguage: ' + ttsMessageText);
        c2tts.simulateButtonClick('src-tts');
    },

    playTargetLanguage: function(ttsMessageText) {
        console.log('playTargetLanguage' + ttsMessageText);
        c2tts.simulateButtonClick('res-tts');
    },

    setReadyWhenFinished: function() {
        console.log('setReadyWhenFinished');
        var finishedInterval = setInterval(function() {
            if (!c2tts.isAudioPlaying()) {
                clearInterval(finishedInterval);
                c2tts.ready = true;
            }
        }, 50);
    },

    simulateButtonClick: function(cssClass) {
        var mouseDown = document.createEvent("MouseEvents");
        mouseDown.initEvent("mousedown", true, true);
        document.getElementsByClassName(cssClass)[0].dispatchEvent(mouseDown);

        var mouseUp = document.createEvent("MouseEvents");
        mouseUp.initEvent("mouseup", true, true);
        document.getElementsByClassName(cssClass)[0].dispatchEvent(mouseUp);
    }
}

var cbParser = {

    messages: [],

    readAndRemoveFromCb: function() {
        REMINDER = 'clipboard-to-tts activated! ';

        $re = /c2tts\{([^\}]*)\}/g;

        try {
            oldCbText = window.clipboardData.getData('Text');
        } catch (err) {
            console.warn('couldnt read clipboard');
            return;
        }


        result = $re.exec(oldCbText);

        if (result) {
            // remove message from cb
            newCbText = REMINDER + oldCbText.replace(result[0], '').trim();
            try {
                window.clipboardData.setData('Text', newCbText);
            } catch (err) {
                console.warn('couldnt write to clipboard');
            }


            // transform message
            var clipboardMessage = result[1];
            var transformedMessage = cbParser.getCheckAndTransformedCollectedMessage(clipboardMessage);

            if (cbParser.messages.indexOf(transformedMessage) == -1) {
                cbParser.messages.push(transformedMessage);
                console.log('new messages: ' + cbParser.messages);
            }
        }
    },

    getCheckAndTransformedCollectedMessage: function(clipboardMessage) {
        if (cbParser.isCollectedMessage(clipboardMessage)) {
            return cbParser.transformCollectedMessage(clipboardMessage);
        } else {
            return clipboardMessage;
        }
    },

    isCollectedMessage: function(text) {
        return text.indexOf(' collected!') !== -1
    },

    transformCollectedMessage: function(collectedClipboard) {
        return collectedClipboard.replace(' collected!', '') + '收集！';
    }
}

var c2ttsManager = {
    start: function() {
        c2ttsManager.startParseCb();
        c2ttsManager.startPlayMessages();
    },

    startParseCb: function() {
        setTimeout(function() {
            cbParser.readAndRemoveFromCb();
            c2ttsManager.startParseCb();
        }, 50); // TODO: shorten interval
    },

    startPlayMessages: function() {
        setInterval(function() {
            if (cbParser.messages.length > 0 && c2tts.ready) {
                message = cbParser.messages.shift();
                c2tts.translateAndPlay(message);
            }
        }, 50); // TODO: shorten interval
    }
}

c2ttsManager.start();