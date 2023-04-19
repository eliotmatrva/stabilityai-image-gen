require('dotenv').config();
//console.log(process.env.stabilityApiKey);

let url = 'https://api.stability.ai';
let endpoints = {
    userAccount: 'v1/uer',
    engines: 'v1/engines',
    imageGen: 'v1/generation'
}

console.log(url + endpoints.imageGen);



(async () => {
    let myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${process.env.stabilityApiKey}`);
        myHeaders.append('Content-Type', 'application/json');

    let options = {
        method: 'GET',
        headers: myHeaders
    }
    let response = await fetch('https://api.stability.ai/v1/engines/list', options);
    let data = await response.json();
    console.log(data);
})()