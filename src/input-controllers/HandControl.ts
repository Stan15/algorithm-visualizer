import Algorithm from "../algorithms/Algorithm";
import Node from "../components/Node";
import { CellType } from "../utils/constants";
import InputController from "./InputController";

export default class HandControl extends InputController {
  cursorLook = "grab";
  displayName = "Hand";
  static TYPE = new HandControl([[]], new Algorithm([]));
  #dragStarted!: boolean;
  #dragStartCellType: CellType = CellType.EMPTY;
  constructor(grid: Node[][], algorithm: Algorithm) {
    super(grid, algorithm);
    this.#setDragStarted(false);
  }
  onDragStart(_: any, row: number, col: number) {
    let cell = this.grid[row][col];
    if (!this.isDraggable(cell)) return;
    this.#setDragStarted(true);
    this.#dragStartCellType = cell.cellType;
  }
  onDragEnd(_: any, row: number, col: number) {
    this.#setDragStarted(false);
  }
  onDragEnter(_: any, row: number, col: number) {
    if (!this.#dragStarted) return;
    let cell = this.grid[row][col];
    cell.setType(this.#dragStartCellType);
    console.log("hi");
    this.algorithm.recompute();
  }

  #setDragStarted = (bool: boolean) => {
    this.#dragStarted = bool;
    if (this.#dragStarted) {
      this.cursorLook = "grabbing";
    } else {
      this.cursorLook = "grab";
    }
  };

  isDraggable(cell: Node) {
    return cell.isStart || cell.isEnd;
  }
  createInstance(grid: Node[][], algorithm: Algorithm): InputController {
    return new HandControl(grid, algorithm);
  }
}
