import './index.scss';
import A from './a';
import B from './b';
import C from './c';
import img from './img.jpg';

console.log(C.name);

const aHtml = document.createElement('p');
aHtml.innerHTML = A.name + '---' + A.age;

const bHtml = document.createElement('p');
bHtml.innerHTML = B.name + '---' + B.age;

const btnAHtml = document.createElement('button');
btnAHtml.innerHTML = 'A';
btnAHtml.addEventListener('click', () => {
    A.age++; 
    aHtml.innerHTML = A.name + '---' + A.age; 
});

const btnBHtml = document.createElement('button');
btnBHtml.innerHTML = 'B';
btnBHtml.addEventListener('click', () => { 
    B.age++;
    bHtml.innerHTML = B.name + '---' + B.age;
});

document.querySelector('.box').appendChild(aHtml);
document.querySelector('.box').appendChild(bHtml);
document.querySelector('.box').appendChild(btnAHtml);
document.querySelector('.box').appendChild(btnBHtml);

const imageEl = document.createElement('img');
imageEl.src = img;
document.querySelector('.box').appendChild(imageEl);

if(module.hot) {
    console.log('支持热模块替换');
    // module.hot.accept('./a');
}