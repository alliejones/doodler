function Node (data) {
  return {
    data: data,
    next: null
  };
}

function LinkedList () {
  this.head = null;
  this.tail = null;
  this.size = 0;
}

LinkedList.prototype.prepend = function(data) {
  var node = new Node(data);
  node.next = this.head;
  this.head = node;
  this.size += 1;
};

LinkedList.prototype.append = function(data) {
  var node = new Node(data);

  if (!this.head) { this.head = node; this.tail = node; }
  else { this.tail.next = node; }

  this.tail = node;
  this.size += 1;
};

LinkedList.prototype.print = function () {
  var curr = this.head;
  var data = [];
  while (curr) {
    data.push(curr.data);
    curr = curr.next;
  }
  return data.join(', ');
};

LinkedList.prototype.toJSON = function () {
  var curr = this.head;
  var nodes = [];
  while (curr) {
    nodes.push(curr.data);
    curr = curr.next;
  }
  return nodes;
};

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

  $(this.el).parent('.canvas-container').on('mousedown', this._onMousedown.bind(this));
  // fix canvas cursor in Chrome
  $(window).on('selectstart', function() { return false; });
  $(window).on('mousemove', this._onMousemove.bind(this));
  $(window).on('mouseup', this._onMouseup.bind(this));
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
  this.curMouseCoords = this._mapCoords(e.pageX - $(window).scrollLeft(), e.pageY - $(window).scrollTop());
};

Canvas.prototype.replay = function() {
  this._clear();
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

Canvas.prototype.clear = function () {
  this.recording = new LinkedList();
  this._clear();
};

Canvas.prototype._clear = function () {
  this.ctx.clearRect(0, 0, this.el.width, this.el.height);
};
