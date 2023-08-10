'use strict';



var script = document.createElement('script');
script.setAttribute("type", "module");
script.setAttribute("src", chrome.runtime.getURL('js/main.js'));
script.setAttribute("data-tv", chrome.runtime.getURL('node_modules/@mediapipe/tasks-vision/wasm/vision_wasm_internal.js'));
script.setAttribute("id", "mediapipe");
var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
head.insertBefore(script, head.lastChild);



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    alert(message);
  });




