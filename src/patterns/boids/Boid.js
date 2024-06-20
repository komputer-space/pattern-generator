import p5 from "p5";
import { boids, wall } from "./sketch";
import { Ray } from "./Ray";

let separationCoef = 0.6;
let alignCoef = 0.5;
let cohesionCoef = 0.6;

let maxSpeed = 2;
let maxForce = 0.1;

let radius = 30;

export class Boid {
  constructor(pFive, pos, vel) {
    this.pFive = pFive;
    this.acc = new p5.Vector();
    this.pos = pos;
    this.vel = vel;
    this.direction = 0;
  }

  drawBoid(x, y, heading) {
    this.pFive.push();
    this.pFive.translate(x, y);
    this.pFive.rotate(heading);
    this.pFive.noFill();
    this.pFive.rect(-4, -4, 8, 8);
    this.pFive.pop();
  }

  display() {
    this.drawBoid(this.pos.x, this.pos.y, this.vel.heading());
  }

  raycast(angle) {
    const ray = new Ray(this.pFive, this.pos, angle);
    // ray.show();
    let pt = ray.cast(wall);
    let d = Infinity;
    if (pt) {
      d = p5.Vector.dist(this.pos, pt);
      if (d < 250) this.showRaycast(pt);
    }
    return d;
  }

  checkForObstacle() {
    const d = this.raycast(this.direction) != Infinity;
    if (d < 200) {
      let bestDirection = this.findUnobstructedDirection(0.2, this.pFive.PI);
      // this.acc.setHeading(bestDirection).mult(100 / d);
    }
    // let force = this.direction
  }

  findUnobstructedDirection(viewAngle, maxAngle) {
    const aLeft = this.direction - viewAngle / 2;
    const aRight = this.direction + viewAngle / 2;
    const dLeft = this.raycast(aLeft);
    const dRight = this.raycast(aRight);
    if (dLeft == Infinity) return aLeft;
    if (dRight == Infinity) return aLeft;
    if (viewAngle < 0.2) {
      return dLeft > dRight ? aLeft : aRight;
    } else {
      return this.findUnobstructedDirection(viewAngle + 0.2, maxAngle);
    }
  }

  showRaycast(pt) {
    this.pFive.push();
    this.pFive.strokeWeight(1);
    this.pFive.stroke("crimson");
    this.pFive.line(this.pos.x, this.pos.y, pt.x, pt.y);
    this.pFive.noStroke();
    this.pFive.fill("aquamarine");
    this.pFive.ellipse(pt.x, pt.y, 7);
    this.pFive.pop();
  }

  separate() {
    let target = new p5.Vector();
    let total = 0;
    boids.forEach((other) => {
      let d = this.pFive.dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
      if (other != this && d < radius) {
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.div(d * d);
        target.add(diff);
        total++;
      }
    });
    if (total == 0) return;

    target.div(total);
    target.setMag(maxSpeed);
    let force = p5.Vector.sub(target, this.vel);
    force.limit(maxForce);
    force.mult(separationCoef);
    this.acc.add(force);
  }

  cohere() {
    let center = new p5.Vector();
    let total = 0;
    boids.forEach((other) => {
      let d = this.pFive.dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
      if (other != this && d < radius) {
        center.add(other.pos);
        total++;
      }
    });
    if (total == 0) return;
    center.div(total);
    let target = p5.Vector.sub(center, this.pos);
    target.setMag(maxSpeed);
    let force = p5.Vector.sub(target, this.vel);
    force.limit(maxForce);
    force.mult(cohesionCoef);
    this.acc.add(force);
  }

  align() {
    let target = new p5.Vector();
    let total = 0;
    boids.forEach((other) => {
      let d = this.pFive.dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
      if (other != this && d < radius) {
        target.add(other.vel);
        total++;
      }
    });
    if (total == 0) return;

    target.div(total);
    target.setMag(maxSpeed);
    let force = p5.Vector.sub(target, this.vel);
    force.limit(maxForce);
    force.mult(alignCoef);
    this.acc.add(force);
  }

  wrap() {
    if (this.pos.x < 0) {
      this.pos.x = this.pFive.width;
    }
    if (this.pos.x > this.pFive.width) {
      this.pos.x = 0;
    }

    if (this.pos.y < 0) {
      this.pos.y = this.pFive.height;
    }

    if (this.pos.y > this.pFive.height) {
      this.pos.y = 0;
    }
  }

  update() {
    this.wrap();

    this.align();
    this.cohere();
    this.separate();

    this.checkForObstacle();

    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.vel.limit(maxSpeed);
    this.direction = this.vel.heading();
  }
}
