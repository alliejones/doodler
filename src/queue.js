function Queue (id, local) {
  this.array = [];
  this.id = id;
  this.local = local || false;
}

Queue.prototype.fromString = function(dataString) {
  var data = dataString.toString().split(';');
  for (var i = 0, length = data.length; i < length; i++) {
    this.queue(data[i]);
  }
};

Queue.prototype.dequeue = function() {
  return this.array.shift();
};

Queue.prototype.queue = function(data) {
  if (this.local) { wsChat.send(data, 'drawing'); }
  this.array.push(data);
};

Queue.prototype.toString = function () {
  return this.array.join(';');
};

Queue.prototype.isEmpty = function () {
  return this.array.length <= 0;
};
