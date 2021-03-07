import React, { useContext } from "react";
import "./DotRing.css";
import useMousePosition from "../../hooks/useMousePosition";
import { MouseContext } from "../../context/mouse-context";

const DotRing = () => {
  const { cursorType, cursorChangeHandler } = useContext(MouseContext);
  const { x, y } = useMousePosition();
  console.log(cursorType);
  return (
    <>
      <div
        style={{ left: `${x}px`, top: `${y}px` }}
        // className={"ring "}
        className={"ring " + cursorType}
      ></div>
      <div
        // className={"dot "}
        className={"dot " + cursorType}
        style={{ left: `${x}px`, top: `${y}px` }}
      ></div>
    </>
  );
};

export default DotRing;
