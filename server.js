require('dotenv').config();
const fs = require('fs');
//console.log(process.env.stabilityApiKey);

let url = 'https://api.stability.ai';
let endpoints = {
    userAccount: 'v1/user',
    engines: 'v1/engines',
    imageGen: 'v1/generation'
}

console.log(url + endpoints.imageGen);

let engineId = 'stable-diffusion-xl-beta-v2-2-2';

function base64_decode(base64Image, file) {
    fs.writeFileSync(file,base64Image);
     console.log('******** File created from base64 encoded string ********');
  
  }

let reqHeaders = new Headers();
    reqHeaders.append('Authorization', `Bearer ${process.env.stabilityApiKey}`);
    reqHeaders.append('Content-Type', 'application/json');

// discord links for generate image:  https://discord.com/channels/1002292111942635562/1042896447311454361/1096559685974368298


async function generateImage(engineId, prompt) {
    console.log(`engine id is ${engineId}`)
    let endpoint = `https://api.stability.ai/v1/generation/${engineId}/text-to-image/`
    let body = JSON.stringify({
        "cfg_scale": 7,
        "height": 512,
        "width": 512,
        "samples": 1,
        "steps": 30,
        "text_prompts": [{
            "text": "A lighthouse on a cliff",
            "weight": 1
        }]
    });
    let options = {
        method: 'POST',
        headers: reqHeaders,
        body: body
    }
    let response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-beta-v2-2-2/text-to-image', options);
    let data = await response.json();
    fs.writeFileSync('base64Encoded.txt', data.artifacts[0].base64, {encoding: 'base64'});

    fs.writeFile('image.png', data.artifacts[0].base64, {encoding: 'base64'}, function(err) {
    });
    // base64_decode(data,'generatedImage.jpg');
    console.log(data.artifacts[0].base64);
}

async function getEngines(){
    let options = {
        method: 'GET',
        headers: reqHeaders
    }
    let response = await fetch('https://api.stability.ai/v1/engines/list', options);
    let data = await response.json();
    console.log(data);
}

generateImage('stable-diffusion-xl-beta-v2-2-2', 'a full body image of a wise old female sage');

