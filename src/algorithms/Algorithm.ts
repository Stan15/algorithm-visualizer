import Node from "../components/Node";

export default class Algorithm {
  grid: Node[][];
  static TYPE: Algorithm | null = null;
  constructor(grid: any[][]) {
    this.grid = grid;
    //if this is not an instance of a sub-class, return (this should be an abstract class, but there is no concept of this in JavaScript)
    if (this.constructor.name === "Algorithm") return;
    this.initializeGridState();
  }
  run(isAnimated = false, ignoreErrors: boolean) {
    this.runAlgo(ignoreErrors);
    if (isAnimated) this.animate();
    else this.draw();
  }
  recompute() {
    this.run(false, true);
  }
  runAlgo(ignoreErrors = false) {
    throw new Error("Method 'runAlgo()' must be implemented.");
  }
  initializeGridState(): void {
    Node.reset();
  }
  createInstance(grid: Node[][]): Algorithm {
    throw new Error("Method 'createInstance()' must be implemented.");
  }

  animate() {
    Node.flushAnimationFrames();
  }
  draw() {
    Node.draw();
  }
}
