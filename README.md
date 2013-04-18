# Doodler

An HTML canvas drawing application that supports recording and playback.

## Usage

### Setup

Doodler requires jQuery.

```js
var canvas = new Canvas({
  id: 'canvas',
  height: 300,
  width: 500
});
```

The script expects a canvas element with an ID (which you specify in the initial settings) wrapped in an element with the class `canvas-container` (this makes drawing off-canvas behave better).

```html
<div class="canvas-container">
  <div id="canvas"></div>
</div>
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
