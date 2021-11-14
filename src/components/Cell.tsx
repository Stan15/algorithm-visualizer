import React from "react";
import Algorithm from "../algorithms/Algorithm";
import InputController from "../input-controllers/InputController";
import Node from "./Node";

export default class Cell extends React.Component<PropShape> {
  render() {
    let style = {
      cursor: this.props.inputController.cursorLook,
    };
    return (
      <div
        className="cell"
        id={`cell-${this.props.row}-${this.props.col}`}
        style={style}
        onMouseUp={(e) =>
          this.props.inputController.onMouseUp(
            e,
            this.props.row,
            this.props.col
          )
        }
        onMouseDown={(e) =>
          this.props.inputController.onMouseDown(
            e,
            this.props.row,
            this.props.col
          )
        }
        onMouseOver={(e) =>
          this.props.inputController.onMouseOver(
            e,
            this.props.row,
            this.props.col
          )
        }
        onDragStart={(e) => {
          this.props.inputController.onDragStart(
            e,
            this.props.row,
            this.props.col
          );
        }}
        onDragEnter={(e) => {
          this.props.inputController.onDragEnter(
            e,
            this.props.row,
            this.props.col
          );
        }}
        onDragEnd={(e) => {
          this.props.inputController.onDragEnd(
            e,
            this.props.row,
            this.props.col
          );
        }}
        onClick={(e) =>
          this.props.inputController.onClick(e, this.props.row, this.props.col)
        }
      ></div>
    );
  }
}

interface PropShape {
  key: number;
  row: number;
  col: number;
  state: Node;
  inputController: InputController;
  algorithm: Algorithm;
}
