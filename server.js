require('dotenv').config();
const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static('public'));
const PORT = process.env.PORT || 3000;

let url = 'https://api.stability.ai';
let endpoints = {
    userAccount: 'v1/user',
    engines: 'v1/engines',
    imageGen: 'v1/generation'
}

console.log(url + endpoints.imageGen);

let engineId = 'stable-diffusion-xl-beta-v2-2-2';

function getTimeStamp(){
    let today = new Date();
    let month = today.getMonth() + 1;
    if (month < 10){
        month = `0${month}`;
    }
    let day = today.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    let year = today.getFullYear();
    let hour = today.getHours();
    let minute = today.getMinutes();
    let seconds = today.getSeconds();
    if (seconds < 10 ) {
        seconds = `0${seconds}`
    }
    if (minute < 10) {
        minute = `0${minute}`
    }
    if (hour < 10) {
        hour = `0${hour}`
    }
    return `${month}${day}${year}-${hour}${minute}${seconds}`;

}

let reqHeaders = new Headers();
    reqHeaders.append('Authorization', `Bearer ${process.env.stabilityApiKey}`);
    reqHeaders.append('Content-Type', 'application/json');

// discord links for generate image:  https://discord.com/channels/1002292111942635562/1042896447311454361/1096559685974368298
let imagePrompt = "a real photograph of a funny fat man playing at the beach";

function writeIndexFile(indexJson, prompt, timeStamp){
    let promptFileIndex = JSON.parse(fs.readFileSync(indexJson));
    promptFileIndex.push({ imageFileName: `image${timeStamp}.png`, prompt: `${prompt}`});
    fs.writeFileSync(indexJson, JSON.stringify(promptFileIndex));
}

async function generateImage(engineId, prompt) {
    console.log(`engine id is ${engineId}`)
    let endpoint = `https://api.stability.ai/v1/generation/${engineId}/text-to-image/`
    let body = JSON.stringify({
        "cfg_scale": 7,
        "height": 512,
        "width": 512,
        "samples": 1,
        "steps": 40,
        "text_prompts": [{
            "text": prompt,
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
    //fs.writeFileSync('base64Encoded.txt', data.artifacts[0].base64, {encoding: 'base64'});
    let timeStamp = getTimeStamp();
    writeIndexFile('prompt-and-file-index.json', prompt, timeStamp);
    fs.writeFile(`image${getTimeStamp()}.png`, data.artifacts[0].base64, {encoding: 'base64'}, function(err) {
    });
    console.log(`image${getTimeStamp()}.png generated and saved!`)
    // base64_decode(data,'generatedImage.jpg');
    //console.log(data.artifacts[0].base64);
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

// generateImage('stable-diffusion-xl-beta-v2-2-2', imagePrompt);

app.get('/api/getLatestImage', async (req, res) => {
    let imageList = JSON.parse(fs.readFileSync('./prompt-and-file-index.json', 'utf8'));
    console.log(typeof(imageList));
    
    function compareFileNames(a,b) {
        if (a.imageFileName > b.imageFileName) {
            return -1;
        } else if (a.imageFileName < b.imageFileName){
            return 1;
        } else {
            return 0;
        }
    };
    let sorted = imageList.sort(compareFileNames);
    console.log(JSON.stringify(sorted[0]));
    res.send(JSON.stringify(sorted[0]));
})

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
})