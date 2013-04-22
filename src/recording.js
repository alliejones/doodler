function Recording () {
  this.array = [];
}

Recording.prototype.fromJSON = function(jsonString) {
  var data = JSON.parse(jsonString);
  for (var i = 0, length = data.length; i < length; i++) {
    this.append(data[i]);
  }
};

Recording.prototype.append = function(data) {
  this.array.push(data);
};

Recording.prototype.toJSON = function () {
  return this.array;
};

Recording.prototype.forEachTimeout = function(func, timeout) {
  if (this.array.length !== 0) {
    this._eachElTimeout(0, func, timeout);
  }
};

Recording.prototype._eachElTimeout = function(index, func, timeout) {
  func(this.array[index]);

  if (this.array.length > index + 1) {
    window.setTimeout(function() {
      this._eachElTimeout(index + 1, func, timeout);
    }.bind(this), timeout);
  }
};
