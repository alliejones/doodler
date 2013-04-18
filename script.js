function Canvas (settings) {
  this.el = document.getElementById(settings.id);
  this.ctx = this.el.getContext('2d');
  this.recordingLoop = null;
  this.mouseCoords = null;
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
  this.mouseCoords = this.mapCoords(e.pageX, e.pageY);
};

Canvas.prototype.replay = function() {
  this.clear();
  this.redraw(this.recording.head);
};

Canvas.prototype.redraw = function (node) {
  console.log(node.data.func, node.data.args);
  this['_'+node.data.func].apply(this, node.data.args);

  if (node.next) {
    window.setTimeout(function () {
      this.redraw(node.next);
    }.bind(this), this.recordingInterval);
  } else {
    this.beginPath();
  }
};

Canvas.prototype.startDrawing = function (e) {
  var coords = this.mapCoords(e.pageX, e.pageY);
  this.recordingLoop = window.setInterval(this.draw.bind(this), this.recordingInterval);
  this.moveTo(coords.x, coords.y);
};

Canvas.prototype.stopDrawing = function () {
  this.ctx.beginPath();
  window.clearInterval(this.recordingLoop);
  this.recordingLoop = null;
};

Canvas.prototype.setStrokeColor = function (color) {
  this.recording.append({ func: 'setStrokeColor', args: [ color ]})
  this._setStrokeColor(color);
};

Canvas.prototype._setStrokeColor = function (color) {
  this.ctx.strokeStyle = color;
};

Canvas.prototype.setStrokeWidth = function (width) {
  this.recording.append({ func: 'setStrokeWidth', args: [ width ]})
  this._setStrokeWidth(width);
};

Canvas.prototype._setStrokeWidth = function (width) {
  this.ctx.lineWidth = width;
};

Canvas.prototype.draw = function() {
  var x = this.mouseCoords.x;
  var y = this.mouseCoords.y;
  this.lineTo(x, y);
};

Canvas.prototype.beginPath = function () {
  this.recording.append({ func: 'beginPath', args: []});
  this._beginPath();
}

Canvas.prototype._beginPath = function () {
  this.ctx.beginPath();
}

Canvas.prototype.moveTo = function (x, y) {
  this.recording.append({ func: 'moveTo', args: [ Math.floor(x), Math.floor(y) ]});
  this._moveTo(x, y);
};

Canvas.prototype._moveTo = function (x, y) {
  this.ctx.beginPath();
  this.ctx.moveTo(x, y);
};

Canvas.prototype.lineTo = function (x, y) {
  this.recording.append({ func: 'lineTo', args: [ Math.floor(x), Math.floor(y) ]});
  this._lineTo(x, y);
};

Canvas.prototype._lineTo = function (x, y) {
  this.ctx.lineTo(x, y);
  this.ctx.stroke();
};

Canvas.prototype.clear = function () {
  this.ctx.clearRect(0, 0, this.el.width, this.el.height);
  this.ctx.beginPath();
};
