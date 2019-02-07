
var MyPromise = require('./promise');

new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(1);
    }, 0);
}).then(value => {
    console.log(value);
})