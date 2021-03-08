Just like the last article, this also focuses on a feature that I would like my portfolio to have. A custom cursor.
I've noticed this treat a lot lately and I think it adds a bit of extra sass to the website.

In this article we'll be making a very basic custom cursor. This could act as a base setup for any kind of cursor you would want to create for your next project.
So let's jump right into the

P.S.: Just React no other dependencies!!

Github Repository: [Click me](https://github.com/holdmypotion/custom-cursors)

Live Example: Click me

# Set up

Run the following command to set up a default react app

```bash
npx create-react-app custom-cursor
cd custom-cursor
yarn start
```

# Final File Structure

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/131b8476-ebb2-4e1d-9f03-f8ddabdc62ab/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/131b8476-ebb2-4e1d-9f03-f8ddabdc62ab/Untitled.png)

# useMousePosition():

I want to add more cursors to this repository in the future and hence I created a separate hook for getting the current position of mouse.

Paste this code in `src/hooks/useMousePosition.js`

```jsx
import { useEffect, useState } from "react";

export default function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });

  useEffect(() => {
    const mouseMoveHandler = (event) => {
      const { clientX, clientY } = event;
      setMousePosition({ x: clientX, y: clientY });
    };
    document.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  return mousePosition;
}
```

In a nut shell, we are listening to an event called `mousemove` and calling a function `mouseMoveHandler` on each mouse movement.
The function then updates the state with the new coordinates and then our precious little hook return those new coordinates.

# Custom Cursor

Here is a simple Dot and Ring cursor.

Paste this code in `src/components/DotRing/DotRing.js` and scroll down for explanation of this code.

```jsx
import "./DotRing.css";
import useMousePosition from "../../hooks/useMousePosition";

const DotRing = () => {
  // 1.
  const { x, y } = useMousePosition();
  return (
    <>
      {/* 2. */}
      <div style={{ left: `${x}px`, top: `${y}px` }} className="ring"></div>
      {/* 3. */}
      <div className="dot" style={{ left: `${x}px`, top: `${y}px` }}></div>
    </>
  );
};

export default DotRing;
```

Let's break it down:

1. We returned `{x, y}` from `useMousePosition()` and here we are using them.
2. This is the outer ring over the dot and we are passing the x and y coordinate to the left and top of this element.
3. This is the dot and we are doing the same this here, passing `left: x` and `top: y`

### DotRing.css

```css
.ring {
  position: fixed;
  top: 0;
  left: 0;
  width: 22px;
  height: 22px;
  border: 2px solid rgba(31, 30, 30, 0.808);
  border-radius: 100%;
  transform: translate(-50%, -50%);
  -webkit-transition-duration: 100ms;
  transition-duration: 100ms;
  -webkit-transition-timing-function: ease-out;
  transition-timing-function: ease-out;
  will-change: width, height, transform, border;
  z-index: 999;
  pointer-events: none;
}

.dot {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background-color: black;
  border-radius: 100%;
  transform: translate(-50%, -50%);
  z-index: 999;
  pointer-events: none;
}
```

One thing to notice here is the transition property, we are delaying the movement of the ring by 100ms. This all is personal preference by the way.

The `will-change` property:

> The will-change CSS property hints to browsers how an element is expected to change. Browsers may set up optimizations before an element is actually changed. These kinds of optimizations can increase the responsiveness of a page by doing potentially expensive work before they are actually required.

# Using The Cursor

### App.js

```jsx
import "./App.css";
import DotRing from "./components/DotRing/DotRing";

function App() {
  return (
    <div className="App">
      <DotRing />
      <div className="container"></div>
      <div className="container" style={{ background: "peachpuff" }}></div>
    </div>
  );
}

export default App;
```

### App.css

```css
.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

a {
  text-decoration: none;
  color: black;
}
```

### index.css

Add this to `index.css` to make the default cursor vanish!

```css
* {
  cursor: none;
}
```

We are done with a good looking cursor but there is one problem here, there is no way to change the way the cursor looks or behave when it is on a certain element.

We'll be doing just that in the next section.

# Mouse Context

Paste this code in `src/context/mouse-context.js`

```jsx
import React, { createContext, useState } from "react";

export const MouseContext = createContext({
  cursorType: "",
  cursorChangeHandler: () => {},
});

const MouseContextProvider = (props) => {
  const [cursorType, setCursorType] = useState("");

  const cursorChangeHandler = (cursorType) => {
    setCursorType(cursorType);
  };

  return (
    <MouseContext.Provider
      value={{
        cursorType: cursorType,
        cursorChangeHandler: cursorChangeHandler,
      }}
    >
      {props.children}
    </MouseContext.Provider>
  );
};

export default MouseContextProvider;
```

This is a very basic context that stores a string, `cursorType` , and a function, `cursorChangeHandler` to change that string.

BTW, if this is your first time tripping over context. Here is a link to my article on [Using React Context API Like a Pro](https://dev.to/holdmypotion/using-react-context-api-like-a-pro-13k5)

## The Big Idea

The thing we are trying to accomplish using this context is to change the `cursorType` by calling the `cursorChangeHandler()` on `onMouseEnter()` and `onMouseLeave()` events of the required element.

We'll later pass this `cursorType` as a className to the cursor and define a class for it in the CSS of our cursor.

# Using the Context

### index.js

Paste the code in `index.js`

```jsx
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import MouseContextProvider from "./context/mouse-context";

ReactDOM.render(
  <React.StrictMode>
    <MouseContextProvider>
      <App />
    </MouseContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

### App.js

Pas

```jsx
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
```

Notice the props `onMouseEnter` and `onMouseLeave` . These props are helping us call the cursorChangeHandler function to change the cursorType.

Now, we'll edit the DotRing.js and DotRing.css file to incorporate the new changes.

### DotRing.js

Overwrite the `src/components/DotRing/DotRing.js` with this code

```jsx
import React, { useContext } from "react";
import "./DotRing.css";
import useMousePosition from "../../hooks/useMousePosition";
import { MouseContext } from "../../context/mouse-context";

const DotRing = () => {
  // 1.
  const { cursorType, cursorChangeHandler } = useContext(MouseContext);

  const { x, y } = useMousePosition();
  return (
    <>
      {/* 2. */}
      <div
        style={{ left: `${x}px`, top: `${y}px` }}
        className={"ring " + cursorType}
      ></div>
      <div
        className={"dot " + cursorType}
        style={{ left: `${x}px`, top: `${y}px` }}
      ></div>
    </>
  );
};
```

Let's break it down

1. Here, we are extracting the stuff out of our context
2. And dynamically adding the `cursortype` to the className

### DotRing.css

```css
.ring {
  position: fixed;
  top: 0;
  left: 0;
  width: 22px;
  height: 22px;
  border: 2px solid rgba(31, 30, 30, 0.808);
  border-radius: 100%;
  transform: translate(-50%, -50%);
  -webkit-transition-duration: 100ms;
  transition-duration: 100ms;
  -webkit-transition-timing-function: ease-out;
  transition-timing-function: ease-out;
  will-change: width, height, transform, border;
  z-index: 999;
  pointer-events: none;
}

.dot {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background-color: black;
  border-radius: 100%;
  transform: translate(-50%, -50%);
  z-index: 999;
  pointer-events: none;
}

.ring.hovered {
  width: 50px;
  height: 50px;
  border-width: 3px;
  border-color: lightgray;
}

.dot.hovered {
  display: none;
}
```

This should be enough to get you started. You can make it as fancy as you want, maybe use keyframes or framer motion to add infinite animation on the cursor, add different `cursorTypes` for different purpos

### Thank you for reading

Leave your reviews.
