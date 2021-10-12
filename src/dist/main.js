"use strict";

var getData = function getData() {
  return fetch('https://jsonplaceholder.typicode.com/posts').then(function (res) {
    return res.json();
  }).then(console.log);
};

getData();
var data = [1, 2, 3, 4, 5, 6, 7];
var one = data[0],
    two = data[1],
    three = data[2];
var data2 = [].concat(data, [9, 8, 10]);
//# sourceMappingURL=maps/main.js.map
