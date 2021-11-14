import Algorithm from "../algorithms/Algorithm";
import Node from "../components/Node";
import InputController from "./InputController";

export default class PlaceStartNode extends InputController {
  displayName = "Start Node";
  static TYPE = new PlaceStartNode([[]], new Algorithm([]));
  onClick(_: any, row: number, col: number) {
    let cell = this.grid[row][col];
    cell.setstart(!cell.isStart);
  }
  createInstance(grid: Node[][], algorithm: Algorithm): InputController {
    return new PlaceStartNode(grid, algorithm);
  }
}
