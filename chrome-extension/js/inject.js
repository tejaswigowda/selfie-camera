'use strict';



var script = document.createElement('script');
script.setAttribute("type", "module");
script.setAttribute("src", chrome.runtime.getURL('js/main.js'));
script.setAttribute("data-tv", chrome.runtime.getURL('js/node_modules/@mediapipe/tasks-vision/wasm'));
script.setAttribute("data-tv2", chrome.runtime.getURL('js/selfie_segmentation.js'));
script.setAttribute("id", "mediapipe");
var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
head.insertBefore(script, head.lastChild);

 script = document.createElement('script');
script.setAttribute("type", "module");
script.setAttribute("src", chrome.runtime.getURL("js/selfie_segmentation.js"));
 head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
head.insertBefore(script, head.lastChild);


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    alert(message);
  });




