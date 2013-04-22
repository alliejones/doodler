# Doodler

An HTML canvas drawing application that supports recording and playback.

## Usage

### Setup

```js
var canvas = new Canvas({
  id: 'canvas',
  height: 300,
  width: 500,
  readOnly: false
});
```

The script expects a div element with an ID (which you specify in the initial settings) that will be used as a wrapper for the actual canvas element which will be created automatically.

`readOnly` is the only optional setting. Its default is `false` (that is, the canvas can be drawn on by default).

The mousedown event which triggers drawing is attached to the wrapper element, so adding some padding to the wrapper element will make the drawing behavior more user-friendly (since it makes it possible to start drawing slightly off-canvas).

```html
<div id="canvas"></div>
```

### Methods

`canvas.line(x1, y1, x2, y2)`  
Draws a line between the points `(x1, y1)` and `(x2, y2)` with the current canvas state (stroke width and color).

`canvas.setStrokeColor(color)`  
Sets the stroke color. Accepts any valid CSS3 color value.

`canvas.setStrokeWidth(width)`  
Sets the stroke width. Width should be an integer (no `px` suffix).

`canvas.translate(x, y)`  
Move the origin of the canvas. The point `(x, y)` will become `(0, 0)`. Saves the previous state of the canvas to the state stack, so the transformation can be reversed with `undoTranslation`. Translations are not added to the recording.

 (This is generally only useful when replaying. Transforming the canvas when a user is drawing will offset the drawn line from the cursor position.)

`canvas.undoTranslate()`  
Undo the effects of the last `translate` call.

`canvas.erase()`  
Clears the canvas (but drawing history is preserved).

`canvas.newHistory()`  
Discard the drawing history.

`canvas.replay()`  
Replay the drawing history. (Does not automatically clear the canvas.)

`canvas.fromJSON(jsonString)`  
Append the drawing events represented in `jsonString` to the canvas history.
