# Doodler

An HTML canvas drawing application that supports recording and playback.

## Usage

### Setup

```js
var canvas = new Canvas({
  id: 'canvas',
  height: 300,
  width: 500
});
```

The script expects a div element with an ID (which you specify in the initial settings) that will be used as a wrapper for the actual canvas element which will be created automatically.

The mousedown event which triggers drawing is attached to the wrapper element, so adding some padding to the wrapper element will make the drawing behavior more user-friendly (since it makes it possible to start drawing slightly off-canvas).

```html
<div id="canvas"></div>
```

### Methods

`canvas.line(x1, y1, x2, y2)`  
Draws a line between the points `x1, y1` and `x2, y2` with the current canvas state (stroke width and color).

`canvas.setStrokeColor(color)`  
Sets the stroke color. Accepts any valid CSS3 color value.

`canvas.setStrokeWidth(width)`  
Sets the stroke width. Width should be an integer (no `px` suffix).

`canvas.clear()`  
Clears the canvas and the recording.

`canvas.replay()`  
Clears the canvas and replays what has been recorded.
