import { initP5 } from "./sketch";

export class BoidsPattern {
  constructor(paperScope, canvas) {
    this.paper = paperScope;

    this.pFive = initP5(canvas);
  }

  draw(points) {}

  reset() {
    console.log(this.pFive);
    this.pFive.remove();
  }
}
