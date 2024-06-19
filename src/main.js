import "./styles/global.scss";
import * as debugLayer from "./debugLayer.js";
import { PatternGenerator } from "./PatternGenerator.js";
import { SketchManual } from "./SketchManual.js";
import { CanvasExporter } from "./CanvasExporter.js";
// import { SerialInput } from "./SerialInput.js";

const app = {
  viewMode: false,
  transparencyMode: false,
  smallScreen: false,
  touchDevice: false,
  domElement: document.getElementById("app"),
  canvas: document.getElementById("canvas"),
};

function setup() {
  app.sketchManual = new SketchManual();
  app.canvasExporter = new CanvasExporter(app.canvas);
  // app.serialInput = new SerialInput(115200);
  app.patternGenerator = new PatternGenerator(app.canvas);

  debugLayer.initDebugLayer();
  debugLayer.addObject(app);
  // debugLayer.addObject(app.serialInput);

  document.onkeydown = processKeyInput;

  window.onresize = resize;
  resize();

  update();
}

function update() {
  app.patternGenerator.update();
  debugLayer.updateDebug();
  requestAnimationFrame(update);
}

setup();

// ---------

function processKeyInput(e) {
  switch (e.code) {
    case "Space":
      toggleViewMode();
      break;
    case "KeyD":
      toggleTransparencyMode();
      break;
    case "KeyR":
      // app.canvasExporter.toggleRecord();
      break;
    case "KeyS":
      if (app.viewMode) app.canvasExporter.saveImage();
      break;
    case "KeyO":
      // app.patternGenerator.exportScene();
      break;
  }
}

function toggleViewMode() {
  console.log("toggle view mode");
  app.viewMode = !app.viewMode;
  app.patternGenerator.setViewMode(app.viewMode);
}

function toggleTransparencyMode() {
  debugLayer.toggleDebugLayer();
  console.log("toggle transparency layer");
  app.transparencyMode = !app.transparencyMode;
  app.patternGenerator.setTransparencyMode(app.transparencyMode);
}

function resize() {
  const width = window.innerWidth;
  if (width < 600) {
    app.smallScreen = true;
    app.sketchManual.setSmallScreenGuides(true);
  } else {
    app.smallScreen = false;
    app.sketchManual.setSmallScreenGuides(false);
  }
}
