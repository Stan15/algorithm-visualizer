import { CellState, cellStateDisplayOrder, CellType } from "../utils/constants";
export default class Node {
  static grid: Node[][] = [];

  static storeAnimFrames = false;
  static AnimationFrames: { cellID: string; cellClass: string }[][] = [];
  static AnimationFPS = 70;

  #row: number;
  #col: number;
  get row() {
    return this.#row;
  }
  get col() {
    return this.#col;
  }
  constructor(row: number, col: number, grid: Node[][]) {
    this.#row = row;
    this.#col = col;
    this.#state = defaultNodeState();
    Node.grid = grid;
  }

  #cellType: CellType = CellType.EMPTY;
  #cellDisplayState: CellState = CellState.UNDEFINED;
  #prevCellType: CellType | null = CellType.EMPTY;
  #prevCellDisplayState: CellState | null = CellState.UNDEFINED;
  get isDirty() {
    return (
      this.#cellType !== this.#prevCellType ||
      this.#cellDisplayState !== this.#prevCellDisplayState
    );
  }
  #clearDirtyFlag = () => {
    this.#prevCellType = this.#cellType;
    this.#prevCellDisplayState = this.#cellDisplayState;
  };

  #setDirtyFlag = () => {
    this.#prevCellType = null;
    this.#prevCellDisplayState = null;
  };

  #state: NodeState;
  predecessor: Node | null = null;

  setpath(bool: boolean, display = false) {
    if (this.#cellType !== CellType.EMPTY) return;
    this.#state.isPath = bool;
    if (bool) this.#setCellState(CellState.PATH);
    else this.#setCellState(CellState.UNDEFINED);
    if (display) this.animate();
  }
  setvisited(bool: boolean, display = false) {
    if (this.#cellType === CellType.WALL) return;
    this.#state.isVisited = bool;
    if (bool) {
      this.#setCellState(CellState.VISITED);
    } else {
      this.#setCellState(CellState.UNDEFINED);
    }
    if (display) this.animate();
  }
  //only overrides current state if it is a higher priority state according to the order defined in cellStateDisplayOrder from constants.ts
  #setCellState = (s: CellState) => {
    if (s === CellState.UNDEFINED) {
      this.#cellDisplayState = s;
      return;
    }
    for (let state of cellStateDisplayOrder) {
      if (state === this.#cellDisplayState) return;
      if (state === s) break;
    }
    this.#cellDisplayState = s;
  };

  static StartNode: Node | null = null;
  static EndNode: Node | null = null;
  static FocusNode: Node | null = null;
  setfocus(bool: boolean, display = false) {
    if (this.#cellType !== CellType.EMPTY) return;
    if (bool) {
      Node.FocusNode?.setfocus(false);
      Node.FocusNode = this;
      this.#setCellState(CellState.FOCUS);
    } else if (this.#state.isFocus) {
      Node.FocusNode = null;
      this.#setCellState(CellState.UNDEFINED);
    }
    this.#state.isFocus = bool;
    if (display) this.animate();
  }
  setstart(bool: boolean, display = true) {
    if (this.isStart === bool || this.isWall || this.isEnd) return;
    if (bool) {
      Node.StartNode?.setstart(false);
      Node.StartNode = this;
      this.#cellType = CellType.START;
    } else if (this.isStart) {
      Node.StartNode = null;
      this.#cellType = CellType.EMPTY;
    }
    if (display) this.animate();
  }
  setend(bool: boolean, display = true) {
    if (this.isEnd === bool || this.isWall || this.isStart) return;
    if (bool) {
      Node.EndNode?.setend(false);
      Node.EndNode = this;
      this.#cellType = CellType.END;
    } else if (this.isEnd) {
      Node.EndNode = null;
      this.#cellType = CellType.EMPTY;
    }
    if (display) this.animate();
  }

  setwall(bool: boolean, display = true) {
    if (this.isWall === bool || this.isStart || this.isEnd) return;
    if (bool) {
      this.#state.weight = Infinity;
      this.#cellType = CellType.WALL;
    } else if (this.isWall) {
      this.#state.weight = 0;
      this.#cellType = CellType.EMPTY;
    }
    if (display) this.animate();
  }

  getAnimToken() {
    return {
      cellID: `cell-${this.row}-${this.col}`,
      cellClass: `cell ${
        this.#cellType === CellType.EMPTY
          ? this.#cellDisplayState
          : this.#cellType
      }`.trim(),
    };
  }

  animate() {
    let cellAnim = this.getAnimToken();
    document.getElementById(cellAnim.cellID)!.className = cellAnim.cellClass;
  }

  static createAnimationFrame() {
    let animationFrame = [];
    for (let row of Node.grid) {
      for (let node of row) {
        if (!node.isDirty) continue;
        animationFrame.push(node.getAnimToken());
        node.#clearDirtyFlag();
      }
    }
    Node.AnimationFrames.push(animationFrame);
  }

  static flushAnimationFrames() {
    setTimeout(() => {
      if (Node.AnimationFrames.length === 0) return;
      requestAnimationFrame(Node.flushAnimationFrames);
      let frame = Node.AnimationFrames.shift()!;
      let cellAnim, element;
      while (frame.length > 0) {
        cellAnim = frame.shift()!;
        element = document.getElementById(cellAnim.cellID)!;
        element.className = cellAnim.cellClass;
      }
    }, 1000 / Node.AnimationFPS);
  }

  static drawLatestFrame() {
    if (Node.AnimationFrames.length === 0) return;
    let frame = Node.AnimationFrames.pop()!;
    Node.AnimationFrames = [];
    let cellAnim, element;
    requestAnimationFrame(() => {
      while (frame.length > 0) {
        cellAnim = frame.shift()!;
        element = document.getElementById(cellAnim.cellID)!;
        element.className = cellAnim.cellClass;
      }
    });
  }
  static draw() {
    for (let row of Node.grid) {
      for (let node of row) {
        node.#setDirtyFlag();
      }
    }
    Node.AnimationFrames = [];
    Node.createAnimationFrame();
    Node.drawLatestFrame();
  }

  clear() {
    this.setstart(false, false);
    this.setend(false, false);
    this.setwall(false, false);
    this.reset();
  }

  reset() {
    this.setfocus(false);
    this.setpath(false);
    this.setvisited(false);
    this.predecessor = null;
    this.exploring = false;
    this.weight = 1;
    this.distance = 0;
    this.#setDirtyFlag();
  }

  static reset() {
    for (let row of Node.grid) {
      for (let node of row) {
        node.reset();
      }
    }
  }
  static clear() {
    for (let row of Node.grid) {
      for (let node of row) {
        node.clear();
      }
    }
  }

  setType(type: CellType, val?: boolean) {
    if (val === undefined) val = true;
    switch (type) {
      case CellType.WALL:
        this.setwall(val);
        break;
      case CellType.START:
        this.setstart(val);
        break;
      case CellType.END:
        this.setend(val);
        break;
    }
  }

  get cellType() {
    return this.#cellType;
  }
  get isFocus() {
    return this.#state.isFocus;
  }
  get isPath() {
    return this.#state.isPath;
  }
  get isVisited() {
    return this.#state.isVisited;
  }
  get exploring() {
    return this.#state.isExploring;
  }
  get isWall() {
    return this.#cellType === CellType.WALL;
  }
  get isStart() {
    return this.#cellType === CellType.START;
  }
  get isEnd() {
    return this.#cellType === CellType.END;
  }
  get weight() {
    return this.#state.weight;
  }
  get distance() {
    return this.#state.distance;
  }

  set exploring(bool: boolean) {
    this.#state.isExploring = bool;
  }
  set weight(w: number) {
    this.#state.weight = w;
  }
  set distance(dist: number) {
    this.#state.distance = dist;
  }
  toString() {
    return `[${this.row},${this.col},w-${this.weight}]`;
  }
}

type NodeState = {
  isPath: boolean;
  isFocus: boolean;
  isVisited: boolean;
  isExploring: boolean;
  weight: number;
  distance: number;
};

function defaultNodeState(): NodeState {
  return {
    isPath: false,
    isFocus: false,
    isVisited: false,
    isExploring: false,
    weight: 1,
    distance: 0,
  };
}
