function Canvas (settings) {
  this.el = document.createElement('canvas');
  this.ctr = document.getElementById(settings.id);
  this.ctx = this.el.getContext('2d');
  this.ctr.appendChild(this.el);

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

  if (!settings.readOnly) {
    this.ctr.addEventListener('mousedown', this._onMousedown.bind(this));
    // fix canvas cursor in Chrome
    window.addEventListener('selectstart', function() { return false; });
    window.addEventListener('mousemove', this._onMousemove.bind(this));
    window.addEventListener('mouseup', this._onMouseup.bind(this));
  }
}

// map coordinates from window to canvas
Canvas.prototype._mapCoords = function (x, y) {
  var boundingBox = this.el.getBoundingClientRect();

  return {
    x: x - boundingBox.left * (this.el.width / boundingBox.width),
    y: y - boundingBox.top * (this.el.height / boundingBox.height)
  };
};

Canvas.prototype._onMousedown = function (e) { this._startDrawing(e); };
Canvas.prototype._onMouseup = function () { this._stopDrawing(); };

Canvas.prototype._onMousemove = function(e) {
  var scroll = this._windowScrollPosition();
  this.curMouseCoords = this._mapCoords(e.pageX - scroll.left, e.pageY - scroll.top);
};

Canvas.prototype._windowScrollPosition = function() {
  var doc = document.documentElement;
  var body = document.body;
  var left = (doc && doc.scrollLeft || body && body.scrollLeft || 0);
  var top = (doc && doc.scrollTop  || body && body.scrollTop  || 0);
  return { left: left, top: top };
};

Canvas.prototype.replay = function() {
  this._redraw(this.recording.head);
};

Canvas.prototype._redraw = function (node) {
  // data: 0: function, 1: function args, 2: canvas state
  this.setStrokeColor(node.data[2][0]);
  this.setStrokeWidth(node.data[2][1]);
  this['_'+node.data[0]].apply(this, node.data[1]);

  if (node.next) {
    window.setTimeout(function () {
      this._redraw(node.next);
    }.bind(this), this.recordingInterval);
  } else {
    this.ctx.beginPath();
  }
};

Canvas.prototype._startDrawing = function (e) {
  var coords = this._mapCoords(e.pageX, e.pageY);
  this.recordingLoop = window.setInterval(this._draw.bind(this), this.recordingInterval);
  this.ctx.moveTo(coords.x, coords.y);
  this.ctx.beginPath();
};

Canvas.prototype._stopDrawing = function () {
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

Canvas.prototype._draw = function() {
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
  this.recording.append([ 'line', [ Math.floor(x1), Math.floor(y1), Math.floor(x2), Math.floor(y2) ], [ this.ctx.strokeStyle, this.ctx.lineWidth ]]);
  this._line(x1, y1, x2, y2);
};

Canvas.prototype._line = function (x1, y1, x2, y2) {
  this.ctx.beginPath();
  this.ctx.moveTo(x1, y1);
  this.ctx.lineTo(x2, y2);
  this.ctx.stroke();
};

Canvas.prototype.translate = function (x, y) {
  this.recording.append([ 'translate', [ x, y ], [] ]);
  this._translate(x, y);
};

Canvas.prototype._translate = function (x, y) {
  this.ctx.save();
  this.ctx.translate(x, y);
};

Canvas.prototype.undoTranslation = function () {
  this.recording.append([ 'clearTranslation', [], [] ]);
  this._clearTranslation();
};

Canvas.prototype._undoTranslation = function () {
  this.ctx.restore();
};

Canvas.prototype.clearHistory = function () {
  this.recording = new LinkedList();
};

Canvas.prototype.erase = function () {
  this.ctx.clearRect(0, 0, this.el.width, this.el.height);
};

Canvas.prototype.fromJSON = function (data) {
  this.recording.fromJSON(data);
};
