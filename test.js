// let arr = ['a', 'b'];
// let result = arr.push('c');
// console.log(arr, result);

// result = arr.pop();
// console.log(arr, result);

// result = arr.unshift('d');
// // console.log(arr, result);

// let arr1 = ['a'],
//     arr2 = ['b', 'c'];

// arr1.push(...arr2); // ES6 spread operator

// console.log(arr1);

// function max() {
//     console.log(arguments);
//     let args = Array.from(arguments);
//     arguments.forEach(element => {
//       console.log(it);
//     });// 1 4
// }

// console.log(max(1,2,3));
// max(1, 4);

// function repeat(str, num) {
//   return new Array(num + 1).join(str);
// }

// console.log(repeat('abc', 3));
// function removeB(arr) {
//   //怎么做
//   let index = arr.indexOf('b') 
//   if (index !== -1) {
//     arr.splice(index, 1);
//   }
// }
// let arr = ['a', 'b', 'c'];
// removeB(arr);
// console.log(arr);


// let arr2 = ['a', 'c'];
// removeB(arr2);
// console.log(arr2);

let arr = [{name: 'mike'}, {name: 'xiaoming'}];

Array.prototype.find = function(cb) {
  this.forEach(it => {
    if (cb() === true) {
      return true;
    }
  });
  return false;
}

let item = arr.find(it => {
      return it.name === 'xiaoming';
    }
)

console.log(item);

Array.prototype.findIndex = function(cb) {
  
}
