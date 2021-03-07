import { useContext } from "react";
import "./App.css";
import DotRing from "./components/DotRing/DotRing";
import { MouseContext } from "./context/mouse-context";

function App() {
  const { cursorType, cursorChangeHandler } = useContext(MouseContext);
  return (
    <div className="App">
      <DotRing />
      <div className="container">
        <div
          onMouseEnter={() => cursorChangeHandler("hovered")}
          onMouseLeave={() => cursorChangeHandler("")}
        >
          <h1>Hover over me</h1>
        </div>
      </div>
      <div className="container" style={{ background: "peachpuff" }}></div>
    </div>
  );
}

export default App;
