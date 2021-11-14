export enum CellType {
  WALL = "cell-wall",
  START = "cell-start",
  END = "cell-end",
  EMPTY = "cell-empty",
}
export enum CellState {
  UNDEFINED = "",
  FOCUS = "cell-focus",
  PATH = "cell-path",
  VISITED = "cell-visited",
}
export let cellStateDisplayOrder = [
  CellState.FOCUS,
  CellState.PATH,
  CellState.VISITED,
];
