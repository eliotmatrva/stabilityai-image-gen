require('dotenv').config();
//console.log(process.env.stabilityApiKey);

let url = 'https://api.stability.ai';
let endpoints = {
    userAccount: 'v1/uer',
    engines: 'v1/engines',
    imageGen: 'v1/generation'
}

console.log(url + endpoints.imageGen);

let engineId = 'stable-diffusion-xl-beta-v2-2-2';

let reqHeaders = new Headers();
    reqHeaders.append('Authorization', `Bearer ${process.env.stabilityApiKey}`);
    reqHeaders.append('Content-Type', 'application/json');

async function generateImage(prompt) {
    let endpoint = `https://api.stability.ai/v1/generation/${engineId}/text-to-image/`
    let body = {
        "cfg_scale": 7,
            "clip_guidance_preset": "FAST_BLUE",
            "height": 512,
            "width": 512,
            "sampler": "K_DPM_2_ANCESTRAL",
            "samples": 1,
            "steps": 75,
            "text_prompts": [
                {
                "text": "A lighthouse on a cliff",
                "weight": 1
                }
            ]
    }
    let options = {
        method:
    }
}

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