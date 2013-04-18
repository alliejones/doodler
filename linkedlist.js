function Node (data) {
  return {
    data: data,
    next: null
  }
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
  };
  console.log(data.join(', '));
}
