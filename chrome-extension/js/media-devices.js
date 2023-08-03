window.doSegmentation = true;
var outCanvas = document.createElement('canvas');
window.outCanvas = outCanvas;
var outCtx = outCanvas.getContext('2d');
window.outCtx = outCtx;



import { FilterStream } from './filter-stream.js';

// Ideally we'd use an editor or import shaders directly from the API.
// import { testFilter as shader } from './shaders/test-filter1.js';
import { testFilter as shader } from './shaders/zeroVideo/test-filter6.js';


function monkeyPatchMediaDevices() {

  const enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;
  const getUserMediaFn = MediaDevices.prototype.getUserMedia;

  MediaDevices.prototype.enumerateDevices = async function () {
    const res = await enumerateDevicesFn.call(navigator.mediaDevices);
    // We could add "Virtual VHS" or "Virtual Median Filter" and map devices with filters.
    res.push({
      deviceId: "selfie",
      groupID: "uhoh",
      kind: "videoinput",
      label: "Selfie Camera",
    });
    return res;
  };

  MediaDevices.prototype.getUserMedia = async function () {
    const args = arguments;
    console.log(args[0]);
    if (args.length && args[0].video && args[0].video.deviceId) {
      if (
        args[0].video.deviceId === "selfie" ||
        args[0].video.deviceId.exact === "selfie"
      ) {
        // This constraints could mimick closely the request.
        // Also, there could be a preferred webcam on the options.
        // Right now it defaults to the predefined input.
        const constraints = {
          video: {
            facingMode: args[0].facingMode,
            advanced: args[0].video.advanced,
            width: args[0].video.width,
            height: args[0].video.height,
          },
          audio: false,
        };
        const res = await getUserMediaFn.call(
          navigator.mediaDevices,
          constraints
        );
        if (res) {
          const filter = new FilterStream(res, shader);
          //alert(typeof filter.outputStream)
          return filter.outputStream;

         // return outCanvas.captureStream();
        }
      }
    }
    const res = await getUserMediaFn.call(navigator.mediaDevices, ...arguments);
    return res;
  };

  console.log('SELFIE CAM INSTALLED.')
}

export { monkeyPatchMediaDevices }