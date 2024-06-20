export class Boundary {
  constructor(pFive, x1, y1, x2, y2) {
    this.pFive = pFive;
    this.a = pFive.createVector(x1, y1);
    this.b = pFive.createVector(x2, y2);
  }

  show() {
    this.pFive.stroke(255);
    this.pFive.line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}
