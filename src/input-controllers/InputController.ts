import Algorithm from "../algorithms/Algorithm";
import Node from "../components/Node";

export default class InputController {
  grid: Node[][];
  algorithm: Algorithm;
  cursorLook = "auto";
  displayName = "";
  displayIcon = "";
  static TYPE: InputController | null = null;
  constructor(grid: Node[][], algorithm: Algorithm) {
    this.grid = grid;
    this.algorithm = algorithm;
  }

  onDragStart(e: any, row: number, col: number) {}
  onDragEnter(e: any, row: number, col: number) {}
  onDragEnd(e: any, row: number, col: number) {}
  onMouseOver(e: any, row: number, col: number) {}
  onMouseUp(e: any, row: number, col: number) {}
  onMouseDown(e: any, row: number, col: number) {}
  onClick(e: any, row: number, col: number) {}

  createInstance(grid: Node[][], algorithm: Algorithm): InputController {
    throw new Error("Method 'createInstance()' must be implemented.");
  }
}
