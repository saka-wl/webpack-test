import { getSum } from "./utils/math";
// import count from './utils/count';
import './css/index.css';
import img from './media/test.png';

console.log('this is app.js');
console.log(getSum(1, 2, 4, 7, 10));

const image = document.createElement('img');
image.src = img;

const btn = document.createElement('button');
// btn.addEventListener('click', count.bind(null, 1, 10));
btn.addEventListener('click', async function () {
    import(/* webpackChunkName: "math" */'./utils/count')
        .then(fn => fn.default(1, 10))
        .catch(err => console.log(err));
});
btn.innerHTML = 'click me';

document.querySelector('.box').appendChild(btn);
document.querySelector('.box').appendChild(image);