function getCheckAndTransformedCollectedMessage(clipboard) {
	if (isCollectedMessage(clipboard)) {
		return transformCollectedMessage(clipboard);
	} else {
		return clipboard;
	}
}

function isCollectedMessage(text) {
	return text.indexOf(' collected!') !== -1
}

function transformCollectedMessage (collectedClipboard) {
	return collectedClipboard.replace(' collected!', '') + '收集！';
}

function translateAndPlay (ttsMessageText) {
	window.location = "https://translate.google.com/m/translate#zh-CN/en/" + encodeURIComponent(ttsMessageText);

	setTimeout(function(){
		playTargetLanguage (ttsMessageText);
	}, 400);
	
	setTimeout(function(){
		playSourceLanguage (ttsMessageText);
	}, 2500);
}

function playSourceLanguage (ttsMessageText) {
	setTimeout(function(){
		var mouseDown = document.createEvent("MouseEvents");
		mouseDown.initEvent("mousedown", true, true);
		document.getElementsByClassName("src-tts")[0].dispatchEvent(mouseDown);

		var mouseUp = document.createEvent("MouseEvents");
		mouseUp.initEvent("mouseup", true, true);
		document.getElementsByClassName("src-tts")[0].dispatchEvent(mouseUp);
	}, 200);
}

function playTargetLanguage (ttsMessageText) {
	setTimeout(function(){
		var mouseDown = document.createEvent("MouseEvents");
		mouseDown.initEvent("mousedown", true, true);
		document.getElementsByClassName("res-tts")[0].dispatchEvent(mouseDown);

		var mouseUp = document.createEvent("MouseEvents");
		mouseUp.initEvent("mouseup", true, true);
		document.getElementsByClassName("res-tts")[0].dispatchEvent(mouseUp);
	}, 200);
}

var remainingPauseTime = 0;
var clipboard = window.clipboardData.getData('Text');

setInterval(function(){
	var curCb = window.clipboardData.getData('Text');
	remainingPauseTime = Math.max(remainingPauseTime - 200, 0);
	
	if (remainingPauseTime == 0 && clipboard != curCb && isCollectedMessage(curCb)) {
		remainingPauseTime = 5000;
		clipboard = window.clipboardData.getData('Text');
		console.log('new clipboard text: ' + clipboard);
		var ttsMessage = getCheckAndTransformedCollectedMessage(clipboard);
		console.log('new ttsMessage: ' + ttsMessage);
		
		translateAndPlay(ttsMessage);
	}
}, 50);

// 石头 collected!
// 苹果 collected!