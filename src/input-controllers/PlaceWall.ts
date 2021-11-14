import React from "react";
import Algorithm from "../algorithms/Algorithm";
import Node from "../components/Node";
import InputController from "./InputController";

export default class PlaceWall extends InputController {
  #mouseDown = false;
  #applyWall = false;
  displayName = "Wall";
  static TYPE = new PlaceWall([[]], new Algorithm([]));
  onMouseDown(_: any, row: number, col: number) {
    let cell = this.grid[row][col];
    if (cell.isStart || cell.isEnd) return;
    this.#mouseDown = true;
    this.#applyWall = !cell.isWall;
    cell.setwall(this.#applyWall, true);
  }
  onMouseOver(_: any, row: number, col: number) {
    if (!this.#mouseDown) return;
    let cell = this.grid[row][col];
    if (cell.isStart || cell.isEnd) return;
    cell.setwall(this.#applyWall, true);
  }
  onMouseUp(_: any, row: number, col: number) {
    this.#mouseDown = false;
  }

  onDragStart(e: React.DragEvent, row: number, col: number) {
    e.preventDefault();
    if (!this.#mouseDown) this.onMouseDown(e, row, col);
  }
  onDragEnd(_: any, row: number, col: number) {
    if (this.#mouseDown) this.onMouseUp(_, row, col);
  }
  createInstance(grid: Node[][], algorithm: Algorithm): InputController {
    return new PlaceWall(grid, algorithm);
  }
}
