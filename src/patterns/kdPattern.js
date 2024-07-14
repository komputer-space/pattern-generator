import { KdTree } from "./KdTree";

export class KdPattern {
  constructor(paperScope, size, maxDepth) {
    this.paper = paperScope;

    this.tree = new KdTree(2, maxDepth);
    this.size = size;
    this.padding = 0;
    this.transparencyMode = false;

    this.shapes = [];
  }

  draw(points) {
    this.reset();
    if (points.length > 0) {
      const kdPoints = points.map((point) => {
        return [point.x, point.y];
      });
      this.tree.run(
        [this.size.width, this.size.height],
        kdPoints,
        this.drawNode.bind(this)
      );
    }
  }

  reset() {
    this.shapes.forEach((shape) => {
      shape.remove();
    });
  }

  setTransparencyMode(value) {
    this.transparencyMode = value;
  }

  drawNode(node) {
    const x1 = (node[0][0] += this.padding);
    const y1 = (node[0][1] += this.padding);
    const x2 = (node[1][0] -= this.padding);
    const y2 = (node[1][1] -= this.padding);
    const rect = this.paper.Shape.Rectangle(x1, y1, x2 - x1, y2 - y1);
    rect.strokeColor = "white";
    this.shapes.push(rect);
  }
}
