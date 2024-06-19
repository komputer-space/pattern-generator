export class KdTree {
  constructor(k, depth) {
    this.k = k; //dimension
    this.depth = depth;
    this.totalPoints;
  }

  run(space, points, drawCallback) {
    this.totalPoints = points;
    // nodes are two dimensional arrays with k points of which everyone has k coordinates
    // generating start node
    let startNode = [];
    startNode.push(space.map(() => 0));
    for (let i = 1; i < space.length; i++) {
      let point = [];
      for (let d = 0; d < space.length; d++) {
        d <= i ? point.push(space[d]) : point.push(0);
      }
      startNode.push(point);
    }
    console.log(startNode);

    // this.generatePoints(n, space, drawPoint);
    this.tree = this.kdSplit(
      this.depth,
      this.totalPoints,
      startNode,
      drawCallback
    );
    console.log(this.tree);
  }

  generatePoints(n, space, drawPoint) {
    for (let i = 0; i < n; i++) {
      // points as n-dimensional arrays
      let point = space.map((dimension) => Math.random() * dimension);
      this.totalPoints.push(point);
      drawPoint(point);
    }
  }

  kdSplit(i, points, node, drawCallback) {
    if (i <= 0 || points.length == 1) {
      drawCallback(node);
      return { node };
    }

    let dimension = i % this.k; // switch dimension

    let sortedPoints = this.sortPoints(points, dimension);
    const medianIndex = Math.round(sortedPoints.length / 2);
    let median = sortedPoints[medianIndex];
    let leftPoints = sortedPoints.slice(0, medianIndex);
    let rightPoints = sortedPoints.slice(medianIndex, sortedPoints.length);

    // TODO: optional random Median?

    console.log(points);
    console.log(dimension);
    console.log(node);

    // left node: update coordinates of all points not in current dimension
    let leftNode = node.map((point, pointD) => {
      return point.map((c, coordD) => {
        if (pointD != 0 && coordD == dimension) {
          return median[dimension];
        } else {
          return c;
        }
      });
    });

    // right node: update coordinates of point in current dimension
    let rightNode = node.map((point, pointD) => {
      return point.map((c, coordD) => {
        if (pointD == 0 && coordD == dimension) {
          return median[dimension];
        } else {
          return c;
        }
      });
    });

    let L, R;

    L = this.kdSplit(i - 1, leftPoints, leftNode, drawCallback);
    R = this.kdSplit(i - 1, rightPoints, rightNode, drawCallback);

    return { node, L, R };
  }

  sortPoints(points, k) {
    let sortedPoints = points.sort((p1, p2) => {
      return p1[k] - p2[k];
    });

    return sortedPoints;
  }
}
