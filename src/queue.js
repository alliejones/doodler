function Queue () {
  this.array = [];
}

Queue.prototype.fromString = function(dataString) {
  var data = dataString.split(',');
  for (var i = 0, length = data.length; i < length; i++) {
    this.queue(data[i]);
  }
};

Queue.prototype.dequeue = function() {
  return this.array.shift();
};

Queue.prototype.queue = function(data) {
  this.array.push(data);
};

Queue.prototype.toString = function () {
  return this.array.join(';');
};

Queue.prototype.isEmpty = function () {
  return this.array.length <= 0;
};
