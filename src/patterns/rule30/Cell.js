export class Cell {
  constructor(pos, size, shape) {
    this.isActive = false;
    this.pos = pos;
    this.size = size;
    this.shape = shape;
  }

  setActive(val) {
    this.isActive = val;
    if (val) this.shape.fillColor = "white";
  }
}
