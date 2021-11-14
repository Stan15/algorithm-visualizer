import Node from "../components/Node";
import PriorityQueue from "../utils/PriorityQueue";
import Algorithm from "./Algorithm";

export default class Dijkstra extends Algorithm {
  unvisited: PriorityQueue<Node> = new PriorityQueue<Node>(
    [],
    (a: Node, b: Node) => {
      return a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0;
    }
  );
  static TYPE = new Dijkstra([[]]);

  runAlgo(ignoreErrors = false) {
    this.initializeGridState();
    if (!Node.StartNode || !Node.EndNode) {
      if (!ignoreErrors) alert("make sure start and end nodes are placed.");
      return;
    }
    Node.StartNode.distance = 0;
    this.unvisited.push(Node.StartNode);
    let current, newDist;
    while (this.unvisited.length > 0) {
      current = this.unvisited.pop()!;
      if (current.isEnd) {
        this.retracePath(current);
        return;
      }
      for (let neighbor of this.getUnvisitedNeighbors(current)) {
        newDist = current.distance + neighbor.weight;
        if (newDist < neighbor.distance) {
          neighbor.distance = newDist;
          neighbor.predecessor = current;
          this.unvisited.push(neighbor);
        }
      }
      current.setvisited(true);
      Node.createAnimationFrame();
    }
  }

  retracePath(node: Node) {
    let path = [];
    while (node.predecessor) {
      path.push(node.predecessor);
      node = node.predecessor;
    }
    for (let i = path.length - 1; i >= 0; i--) {
      node = path[i];
      node.setpath(true);
      Node.createAnimationFrame();
    }
  }

  getUnvisitedNeighbors(node: Node) {
    let neighbors: Node[] = [];
    let row = node.row;
    let col = node.col;

    let isValid = (row: number, col: number) => {
      let idxValid =
        row >= 0 &&
        row < this.grid.length &&
        col >= 0 &&
        col < this.grid[0].length;
      if (!idxValid) return false;
      let cell = this.grid[row][col];
      return idxValid && !cell.isVisited && !cell.isWall;
    };

    if (isValid(row - 1, col)) neighbors.push(this.grid[row - 1][col]);
    if (isValid(row + 1, col)) neighbors.push(this.grid[row + 1][col]);
    if (isValid(row, col - 1)) neighbors.push(this.grid[row][col - 1]);
    if (isValid(row, col + 1)) neighbors.push(this.grid[row][col + 1]);

    // if (isValid(row - 1, col - 1)) neighbors.push(this.grid[row - 1][col - 1]);
    // if (isValid(row + 1, col + 1)) neighbors.push(this.grid[row + 1][col + 1]);
    // if (isValid(row - 1, col + 1)) neighbors.push(this.grid[row - 1][col + 1]);
    // if (isValid(row + 1, col - 1)) neighbors.push(this.grid[row + 1][col - 1]);

    return neighbors;
  }

  initializeGridState(): void {
    super.initializeGridState();
    for (let row of this.grid) {
      for (let node of row) {
        node.distance = Infinity;
        node.weight = 1;
      }
    }
  }

  createInstance(grid: Node[][]) {
    return new Dijkstra(grid);
  }
}
