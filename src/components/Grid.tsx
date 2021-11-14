import React from "react";
import Cell from "./Cell";
import "../styles/Grid.css";
import Dijkstra from "../algorithms/Dijkstra";
import Algorithm from "../algorithms/Algorithm";
import Node from "./Node";
import InputController from "../input-controllers/InputController";
import HandControl from "../input-controllers/HandControl";
import PlaceStartNode from "../input-controllers/PlaceStartNode";
import PlaceWall from "../input-controllers/PlaceWall";
import PlaceEndNode from "../input-controllers/PlaceEndNode";

type props = {};
type state = {
  grid: Node[][];
  algorithm: Algorithm;
  inputController: InputController;
};

export default class Grid extends React.Component<props, state> {
  setInputController(controller: InputController) {
    let inputController = controller.createInstance(
      this.state.grid,
      this.state.algorithm
    );
    this.setState({ inputController: inputController });
    this.setAlgorithm(this.state.algorithm); // clear the side effects of running the algorithm on input change
  }

  setAlgorithm(algo: Algorithm) {
    let algorithm = algo.createInstance(this.state.grid);
    this.setState({ algorithm: algorithm });
    Node.draw();
  }

  constructor(props: any) {
    super(props);
    let grid = this.generateEmptyGrid(30, 40);
    let algorithm = new Dijkstra(grid);
    this.state = {
      grid: grid,
      algorithm: algorithm,
      inputController: new PlaceWall(grid, algorithm),
    };
  }

  componentDidMount() {
    Node.draw();
  }

  render() {
    const grid = this.state.grid;
    return (
      <React.Fragment>
        <div id="input-controls">
          <button onClick={() => this.setInputController(HandControl.TYPE)}>
            {HandControl.TYPE.displayName}
          </button>
          <button onClick={() => this.setInputController(PlaceWall.TYPE)}>
            {PlaceWall.TYPE.displayName}
          </button>
          <button onClick={() => this.setInputController(PlaceStartNode.TYPE)}>
            {PlaceStartNode.TYPE.displayName}
          </button>
          <button onClick={() => this.setInputController(PlaceEndNode.TYPE)}>
            {PlaceEndNode.TYPE.displayName}
          </button>
          <button onClick={() => this.runAlgorithm(true)}>Run</button>
        </div>
        <div id="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className="row">
                {row.map((Node, colIdx) => {
                  return (
                    <Cell
                      key={colIdx}
                      row={rowIdx}
                      col={colIdx}
                      state={Node}
                      inputController={this.state.inputController}
                      algorithm={this.state.algorithm}
                    ></Cell>
                  );
                })}
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  }

  runAlgorithm(isAnimated?: boolean) {
    this.setInputController(HandControl.TYPE);
    this.state.algorithm.run(isAnimated, false);
  }

  generateEmptyGrid(rows: number, cols: number): Node[][] {
    let grid: Node[][] = [];
    for (let row = 0; row < rows; row++) {
      let rowItems = [];
      for (let col = 0; col < cols; col++) {
        rowItems.push(new Node(row, col, grid));
      }
      grid.push(rowItems);
    }
    return grid;
  }
}
