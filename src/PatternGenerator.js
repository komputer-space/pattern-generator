import { FileImporter } from "./FileImporter";
import { GamePadInput } from "./GamePadInput";
import { SerialInput } from "./SerialInput";
import { FilterPad } from "./FilterPad";
import { PaperScope } from "paper";
import { KdPattern } from "./patterns/kdPattern";
import { ReferenceImage } from "./ReferenceImage";

const PAPER = new PaperScope();

export class PatternGenerator {
  constructor(canvas) {
    this.canvas = canvas;
    this.importer = new FileImporter(this);

    this.gamePadInput = new GamePadInput();
    this.serialInput = new SerialInput(115200);
    this.filterPad = new FilterPad(this.setPattern.bind(this));
    this.referenceImage = new ReferenceImage();

    PAPER.setup(this.canvas);
    this.pointTool = new PAPER.Tool();
    this.points = [];
    this.pattern;
    this.viewSize = PAPER.view.viewSize;

    this.pointTool.onMouseDown = (e) => this.pointToolMouseDown(e);
    this.pointTool.onMouseDrag = (e) => this.pointToolMouseDrag(e);
    this.setPattern(1);
    //setup kd tree
    // initP5(this.canvas);
  }

  update() {}

  setViewMode(value) {
    console.log("set view mode");
  }

  setTransparencyMode(value) {
    console.log("set transparency mode");
  }

  processSerialData() {
    if (this.serialInput.connected) {
      const input = this.serialInput.serialData;
      console.log(input);
    }
  }

  pointToolMouseDown(e) {
    this.points.push(e.point);
    this.drawPoint(e.point);
    if (this.pattern) this.pattern.draw(this.points);
  }

  pointToolMouseDrag(e) {}

  drawPoint(point) {
    const pointShape = new PAPER.Shape.Circle(point, 5);
    pointShape.strokeColor = "#FF5414";
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
        console.log("pattern " + index);
        break;
      case 3:
        console.log("pattern " + index);
        break;
      case 4:
        console.log("pattern " + index);
        break;
      case 5:
        console.log("pattern " + index);
        break;
      case 6:
        console.log("pattern " + index);
        break;
      case 7:
        console.log("pattern " + index);
        break;
      case 8:
        console.log("pattern " + index);
        break;
      default:
        break;
    }
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
