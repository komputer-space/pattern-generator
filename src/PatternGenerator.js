import { PaperScope } from "paper";

import { FileImporter } from "./FileImporter";
import { SerialInput } from "./SerialInput";
import { FilterPad } from "./FilterPad";
import { InfoLayer } from "./InfoLayer";

import { KdPattern } from "./patterns/KdPattern";
import { ReferenceImage } from "./ReferenceImage";
import { BoidsPattern } from "./patterns/boids/BoidsPattern";
import { Rule30Pattern } from "./patterns/rule30/Rule30Pattern";
import { view } from "paper/dist/paper-core";

const PAPER = new PaperScope();

export class PatternGenerator {
  constructor(canvas) {
    this.transparencyMode = false;
    this.freeze = false;
    this.idle = false;
    this.idleInterval;

    this.importer = new FileImporter(this);

    this.infoLayer = new InfoLayer();

    // -------

    this.canvas = canvas;

    this.serialInput = new SerialInput(115200);
    this.filterPad = new FilterPad(this.setPattern.bind(this));
    this.referenceImage = new ReferenceImage();

    PAPER.setup(this.canvas);
    this.pointTool = new PAPER.Tool();
    this.points = [];
    this.backupPoints = [];
    this.pointMarkers = [];
    this.pattern;
    this.viewSize = PAPER.view.viewSize;

    this.pointTool.onMouseDown = (e) => this.pointToolMouseDown(e);
    this.pointTool.onMouseDrag = (e) => this.pointToolMouseDrag(e);
    this.setPattern(1);
    //setup kd tree
    // initP5(this.canvas);
  }

  // --- CORE METHODS

  update() {}

  resize(width, height) {}

  setViewMode(value) {
    this.freeze = value;
    console.log("set view mode");
  }

  setTransparencyMode(value) {
    console.log("set transparency mode");
    this.transparencyMode = value;
    this.pattern.setTransparencyMode(value);
    this.showPoints(value);
  }

  setIdleMode(value) {
    if (this.idle != value) {
      this.idle = value;
      if (this.idle) {
        this.backupPoints = this.points;
        this.points = [];
        this.idleInterval = setInterval(this.addRandomPoint.bind(this), 1000);
      } else {
        clearInterval(this.idleInterval);
        this.points = this.backupPoints;
        this.backupPoints = [];
      }
      this.updatePattern();
    }
  }

  loadNewExample() {
    console.log("loading next example");
  }

  // --- INPUTS

  processSerialData() {
    if (this.serialInput.connected) {
      const input = this.serialInput.serialData;
      console.log(input);
    }
  }

  pointToolMouseDown(e) {
    if (!this.freeze) this.addPoint(e.point);
  }

  pointToolMouseDrag(e) {}

  // --- CUSTOM METHODS

  updateView() {
    this.updatePattern();
    this.setTransparencyMode(this.transparencyMode);
  }

  addPoint(point) {
    this.points.push(point);
    this.drawPoint(point);
    this.updatePattern();
    this.showPoints(true);
    if (!this.transparencyMode) setTimeout(() => this.showPoints(false), 1000);
  }

  addRandomPoint() {
    const point = new PAPER.Point(
      Math.random() * this.viewSize.width,
      Math.random() * this.viewSize.height
    );
    this.addPoint(point);
    this.updatePattern;
  }

  drawPoint(point) {
    const pointMarker = new PAPER.Shape.Circle(point, 5);
    pointMarker.strokeColor = "#FF5414";
    this.pointMarkers.push(pointMarker);
  }

  showPoints(value) {
    this.pointMarkers.forEach((pointMarker) => (pointMarker.visible = value));
  }

  updatePattern() {
    if (this.pattern) this.pattern.draw(this.points);
    this.pointMarkers.forEach((pointMarker) => pointMarker.remove());
    this.pointMarkers = [];
    this.points.map((point) => this.drawPoint(point));
  }

  setPattern(index) {
    if (this.pattern) this.pattern.reset();
    switch (index) {
      case 1:
        console.log(this.points);
        this.pattern = new KdPattern(PAPER, this.viewSize, 100);
        this.pattern.draw(this.points);
        break;
      case 2:
        this.pattern = new Rule30Pattern(PAPER, this.viewSize, 100);
        this.pattern.draw(this.points);
        console.log("pattern " + index);
        break;
      case 3:
        this.pattern = new BoidsPattern(PAPER, this.canvas);
        console.log("pattern " + index);
        break;
      case 4:
        this.pattern = null;
        console.log("pattern " + index);
        break;
      case 5:
        this.pattern = null;
        console.log("pattern " + index);
        break;
      case 6:
        this.pattern = null;
        console.log("pattern " + index);
        break;
      case 7:
        this.pattern = null;
        console.log("pattern " + index);
        break;
      case 8:
        this.pattern = null;
        console.log("pattern " + index);
        break;
      default:
        break;
    }
    this.updateView();
  }

  // --- FILE IMPORTS

  importGlTF(url) {
    this.gltfLoader.load(
      url,
      (gltf) => {
        console.log("loaded gltf");
      },
      undefined,
      function (error) {
        console.log("could not load object");
        console.error(error);
        reject();
      }
    );
  }

  importImage(url) {
    this.referenceImage.setImage(url);
  }
}
