import Algorithm from "../algorithms/Algorithm";
import Node from "../components/Node";
import InputController from "./InputController";

export default class PlaceEndNode extends InputController {
  displayName = "End Node";
  static TYPE = new PlaceEndNode([[]], new Algorithm([]));
  onClick(_: any, row: number, col: number) {
    let cell = this.grid[row][col];
    cell.setend(!cell.isEnd);
  }
  createInstance(grid: Node[][], algorithm: Algorithm): InputController {
    return new PlaceEndNode(grid, algorithm);
  }
}
