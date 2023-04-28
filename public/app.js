let root = document.getElementById('root');
root.innerHTML = '<b>hello world</b>';
console.log(root);

async function getImage() {
    return await fetch(`http://localhost:3000/api/getLatestImage`);
}

function renderImage() {
    let rootElem = document.getElementById('root');
    rootElem.innerHTML = `<img src=${getImage()}>`
}

renderImage();
