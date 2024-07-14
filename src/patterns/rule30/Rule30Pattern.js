import { Cell } from "./Cell";

export class Rule30Pattern {
  constructor(paperScope, size) {
    this.paper = paperScope;

    this.gridSize = 20;
    this.size = size;
    this.padding = 0;
    this.transparencyMode = false;

    this.cells = []; // 2D Array with rows of cells
    this.shapes = [];
    this.indices = [];
  }

  draw(points) {
    console.log("draw");
    this.reset();
    const columns = this.size.width / this.gridSize;
    const rows = this.size.height / this.gridSize;
    for (let y = 0; y < rows; y++) {
      const row = [];
      for (let x = 0; x < columns; x++) {
        const pos = new this.paper.Point(x * this.gridSize, y * this.gridSize);
        const shape = this.drawCell(pos, this.gridSize);
        const cell = new Cell(pos, this.gridSize, shape);
        cell.setActive(this.containsPoint(shape, points));
        row.push(cell);
        this.shapes.push(shape);
      }
      this.cells.push(row);
    }
    this.drawPattern();
    this.drawIndeces();
  }

  drawCell(pos, size) {
    const rect = this.paper.Shape.Rectangle(pos.x, pos.y, size, size);
    // rect.strokeColor = "white";
    return rect;
  }

  containsPoint(cell, points) {
    let active = false;
    points.forEach((point) => {
      if (cell.contains(point)) active = true;
    });
    return active;
  }

  drawPattern() {
    let nextRowPattern = [];
    this.cells.forEach((row) => {
      const rowPattern = row.map((cell, i) => {
        let val;
        if (!cell.isActive) {
          val = nextRowPattern[i] ?? false;
        } else {
          val = cell.isActive; // cell was set active by user -> == true
        }
        cell.setActive(val);
        return val;
      });
      nextRowPattern = this.rule30(rowPattern);
    });
  }

  rule30(rowPattern) {
    const nextRowPattern = [];
    // console.log(rowPattern);
    rowPattern.forEach((c, i) => {
      const cLeft = rowPattern[i - 1] ?? null;
      const cRight = rowPattern[i + 1] ?? null;
      const cellPattern = [cLeft ?? false, c, cRight ?? false];
      const patternCode = JSON.stringify(cellPattern);

      let newVal = false;
      switch (patternCode) {
        case "[true,true,true]":
          newVal = false;
          break;
        case "[true,true,false]":
          newVal = false;
          break;
        case "[true,false,true]":
          newVal = false;
          break;
        case "[true,false,false]":
          newVal = true;
          break;
        case "[false,true,true]":
          newVal = true;
          break;
        case "[false,true,false]":
          newVal = true;
          break;
        case "[false,false,true]":
          newVal = true;
          break;
        case "[false,false,false]":
          newVal = false;
          break;
      }
      nextRowPattern.push(newVal);
    });
    // console.log(nextRowPattern);
    return nextRowPattern;
  }

  drawIndeces() {
    this.cells.forEach((row, y) => {
      row.forEach((cell, x) => {
        const index = new this.paper.PointText({
          point: cell.pos.add(this.gridSize / 2, this.gridSize / 2),
          content: y * x,
          fillColor: "#00ff9e",
          fontSize: 7,
          font: "Recursive",
        });
        this.indices.push(index);
      });
    });
  }

  setTransparencyMode(value) {
    this.transparencyMode = value;
    this.indices.forEach((index) => (index.visible = value));
  }

  reset() {
    this.shapes.forEach((shape) => {
      shape.remove();
    });
    this.indices.forEach((index) => {
      index.remove();
    });
    this.cells = [];
    this.indices = [];
    this.shapes = [];
  }
}
