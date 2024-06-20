import p5 from "p5";
import { Boid } from "./Boid";
import { Boundary } from "./Boundary";
import { Ray } from "./Ray";

let n = 100;
export let boids = [];

export let wall;

export function initP5(canvas) {
  const pFive = new p5(function (pFive) {
    pFive.setup = function () {
      pFive.createCanvas(window.innerWidth, window.innerHeight, canvas);
      pFive.stroke(255);
      pFive.strokeWeight(2);

      for (let i = 0; i < n; i++) {
        let pos = new p5.Vector(
          pFive.random(0, pFive.width),
          pFive.random(0, pFive.height)
        );
        let vel = p5.Vector.random2D();
        boids[i] = new Boid(pFive, pos, vel);
      }

      wall = new Boundary(pFive, 300, 100, 300, 600);
    };

    pFive.draw = function () {
      pFive.background(0);

      boids.forEach((b) => {
        b.update();
        b.display();
      });

      wall.show();
    };
  });
  return pFive;
}
