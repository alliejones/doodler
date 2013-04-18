function Canvas (settings) {
  this.el = document.getElementById(settings.id);
  this.ctx = this.el.getContext('2d');

  this.prevMouseCoords = { x: null, y: null };
  this.mouseCoords = { x: null, y: null };
  this.curMouseCoords = { x: null, y: null };

  this.recordingLoop = null;
  this.recording = new LinkedList();
  this.recordingInterval = 10; // ms

  this.el.width = settings.width;
  this.el.height = settings.height;

  this.ctx.lineCap = 'round';
  this.ctx.lineJoin = 'round';
  this.ctx.strokeStyle = 'black';

  $(this.el).parent('.canvas-container').on('mousedown', this.onMousedown.bind(this));
  // fix canvas cursor in Chrome
  $(window).on('selectstart', function() { return false; });
  $(window).on('mousemove', this.onMousemove.bind(this));
  $(window).on('mouseup', this.onMouseup.bind(this));
}

// map coordinates from window to canvas
Canvas.prototype.mapCoords = function (x, y) {
  var boundingBox = this.el.getBoundingClientRect();

  return {
    x: x - boundingBox.left * (this.el.width / boundingBox.width),
    y: y - boundingBox.top * (this.el.height / boundingBox.height)
  };
};

Canvas.prototype.onMousedown = function (e) { this.startDrawing(e); };
Canvas.prototype.onMouseup = function () { this.stopDrawing(); };

Canvas.prototype.onMousemove = function(e) {
  this.curMouseCoords = this.mapCoords(e.pageX, e.pageY);
};

Canvas.prototype.replay = function() {
  this.clear();
  this.redraw(this.recording.head);
};

Canvas.prototype.redraw = function (node) {
  console.log(node.data.func, node.data.args, node.data.settings);
  this.setStrokeWidth(node.data.settings.strokeWidth);
  this.setStrokeColor(node.data.settings.strokeColor);
  this['_'+node.data.func].apply(this, node.data.args);

  if (node.next) {
    window.setTimeout(function () {
      this.redraw(node.next);
    }.bind(this), this.recordingInterval);
  } else {
    this.ctx.beginPath();
  }
};

Canvas.prototype.startDrawing = function (e) {
  var coords = this.mapCoords(e.pageX, e.pageY);
  this.recordingLoop = window.setInterval(this.draw.bind(this), this.recordingInterval);
  this.ctx.moveTo(coords.x, coords.y);
  this.ctx.beginPath();
};

Canvas.prototype.stopDrawing = function () {
  this.ctx.beginPath();
  this.prevMouseCoords = { x: null, y: null };
  this.mouseCoords = { x: null, y: null };
  window.clearInterval(this.recordingLoop);
  this.recordingLoop = null;
};

Canvas.prototype.setStrokeColor = function (color) {
  this.ctx.strokeStyle = color;
};

Canvas.prototype.setStrokeWidth = function (width) {
  this.ctx.lineWidth = width;
};

Canvas.prototype.draw = function() {
  var x1 = this.prevMouseCoords.x = this.mouseCoords.x;
  var y1 = this.prevMouseCoords.y = this.mouseCoords.y;
  var x2 = this.mouseCoords.x = this.curMouseCoords.x;
  var y2 = this.mouseCoords.y = this.curMouseCoords.y;
  if (x1 === null || y1 === null) {
    x1 = x2;
    y1 = y2;
  }
  this.line(x1, y1, x2, y2);
};

Canvas.prototype.line = function (x1, y1, x2, y2) {
  this.recording.append({ func: 'line', args: [ Math.floor(x1), Math.floor(y1), Math.floor(x2), Math.floor(y2) ], settings: { strokeColor: this.ctx.strokeStyle, strokeWidth: this.ctx.lineWidth }});
  this._line(x1, y1, x2, y2);
};

Canvas.prototype._line = function (x1, y1, x2, y2) {
  this.ctx.beginPath();
  this.ctx.moveTo(x1, y1);
  this.ctx.lineTo(x2, y2);
  this.ctx.stroke();
};

Canvas.prototype.clear = function () {
  this.ctx.clearRect(0, 0, this.el.width, this.el.height);
  this.ctx.beginPath();
};
