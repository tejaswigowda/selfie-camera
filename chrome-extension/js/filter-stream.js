import { ShaderRenderer } from './shader-renderer.js';

//alert(chrome.runtime.getURL("../node_modules/@mediapipe/tasks-vision"));

/*
import {
  FilesetResolver,
  ImageSegmenter
} 
// from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";
// from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.1.0-alpha-14/vision_bundle.js";
from "./node_modules/@mediapipe/tasks-vision/vision_bundle.js"

*/

var { FilesetResolver, ImageSegmenter } = 
await import(document.getElementById("mediapipe").dataset.tv2);

var runningMode = "IMAGE";
var imageSegmenter;

async function createImageSegmenter() {
  const vision = await FilesetResolver.forVisionTasks(
    //"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    //"./node_modules/@mediapipe/tasks-vision/wasm"
    document.getElementById("mediapipe").dataset.tv
    //chrome.runtime.getURL("@mediapipe/tasks-vision/wasm")
  );

  imageSegmenter = await ImageSegmenter.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
      //"https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite"
      // "https://storage.googleapis.com/mediapipe-assets/deeplabv3.tflite"
      "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter_landscape/float16/latest/selfie_segmenter_landscape.tflite"
    },
    outputCategoryMask: true,//true,
    outputConfidenceMasks: true,
    runningMode: runningMode
  });


}
//createImageSegmenter();



window.selfieSegmentation = new SelfieSegmentation({locateFile: (file) => {
  //return document.getElementById("mediapipe").dataset.tv2;
  return "js/selfie_segmentation.js";
}});
window.selfieSegmentation.onResults(onResults);


function onResults(results) {
  alert(results);
}




var maskCanvas = document.createElement('canvas');
window.maskCanvas = maskCanvas;
var maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
window.maskCtx = maskCtx;


ShaderRenderer.prototype.setUniform = function (name, value) {
  const uniform = this.uniforms[name];
  if (uniform) {
    uniform.value = value;
  }
};

class FilterStream {
  constructor(stream, shader) {
    console.log("New Filter for stream", stream);
    this.stream = stream;
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    this.canvas = canvas;
    window.shaderCanvas = canvas;
    this.video = video;
    this.renderer = new ShaderRenderer(this.canvas, video, shader);



    video.addEventListener("playing", () => {
      // Use a 2D Canvas.
      maskCanvas.width = this.video.videoWidth;
      maskCanvas.height = this.video.videoHeight;


      // Use a WebGL Renderer.
      this.renderer.setSize(this.video.videoWidth, this.video.videoHeight);
      this.update();
    });
    video.srcObject = stream;
    video.autoplay = true;
    this.video = video;
    this.outputStream = window.outCanvas.captureStream();
  }

  async update() {

    await window.selfieSegmentation.send({image: maskCanvas});

  if(window.doSegmentation) {
    maskCtx.drawImage(this.video, 0, 0);


    imageSegmenter.segment(maskCanvas, function (segmentation) {
      //console.log(segmentation);

      let imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height).data;
      var mask = segmentation.categoryMask.getAsUint8Array();

      // get confidence mask
      //mask = segmentation.confidenceMasks[0].getAsUint8Array();
      //console.log(mask);



      //const mask = segmentation.confidenceMask.getAsUint8Array();
     //console.log(mask);

      for (let i in mask) {
        if (mask[i] > 1){
        imageData[i * 4] = 0//legendColor[0]//(legendColor[0] + imageData[i * 4]) / 2;
        imageData[i * 4 + 1] = 0//legendColor[1]//(legendColor[1] + imageData[i * 4 + 1]) / 2;
        imageData[i * 4 + 2] = 0//legendColor[2]//(legendColor[2] + imageData[i * 4 + 2]) / 2;
        imageData[i * 4 + 3] = 0//legendColor[3]//(legendColor[3] + imageData[i * 4 + 3]) / 2;
        }
      }
      const uint8Array = new Uint8ClampedArray(imageData.buffer);
      const dataNew = new ImageData(uint8Array, maskCanvas.width, maskCanvas.height);
      maskCtx.putImageData(dataNew, 0, 0);

    });

  }
  




      this.renderer.render()


    



    requestAnimationFrame(() => this.update());
  }
}

export { FilterStream }