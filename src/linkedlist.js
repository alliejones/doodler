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

LinkedList.prototype.fromJSON = function(jsonString) {
  var data = JSON.parse(jsonString);
  for (var i = 0, length = data.length; i < length; i++) {
    this.append(data[i]);
  }
};

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
