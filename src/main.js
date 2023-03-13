// This is __god_awful_code__ that is polluting the global space
// TODO: Properly encapsulate everything.
import perlin1D from './generator';
import randomwords from 'random-words';
import { spectralSolve } from './orography';
import seedrandom from 'seedrandom';

const canvas = document.getElementById("maincanvas");
const ctx = canvas.getContext('2d');

const optimalHeight = 300;
let scaleFactor = (window.innerHeight/(3*optimalHeight));

const speedSlider = document.getElementById("speedslider");
const nSlider = document.getElementById("nslider");
const seedInput = document.getElementById("seedinput");


randomInput();
function randomInput(){
    seedInput.value = randomwords(2).join(' ');
}
document.getElementById('randomizer').addEventListener('click',randomInput);


let u = 300;
speedSlider.value = u;

speedSlider.addEventListener("input",(e)=>{
    u = e.target.value;
})

let N=0.01;
nSlider.value = N*100;

nSlider.addEventListener('input',(e)=>{
    N = e.target.value / 100;
})

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


window.addEventListener("resize",()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    scaleFactor = (window.innerHeight/(3*optimalHeight));
    draw(orthogs,colors,null);
});


// let falloff = 10;
// let falloffStrength = 5;
// let dragging = false;
// let selectedPoint = -1;
// window.addEventListener("mousemove",(e)=>{
//     let x=e.clientX;
//     let y=e.clientY;
//     if(!dragging){
//         selectedPoint = -1;
//         for(let i=5; i <= orography.length -5;i+=10){
//             let distToPoint = Math.pow(y - (canvas.height - orography[i]),2) + Math.pow(x-(i*canvas.width)/(orography.length-1),2)
//             if (distToPoint < 20*20) {
//                 selectedPoint = i;
//                 break;
//             } 
//         }
//     }else{
//         //Dragging
//         let localY = (canvas.height - y);
//         orography[selectedPoint] = localY; 
//         for(let i=1; i<falloff;i++){
//             orography[i+selectedPoint] -= dY*bulge(i+1,falloff)
//             orography[-1*i+selectedPoint] -= dY*bulge(i+1,falloff)
//         }
        
//     }
// })
// window.addEventListener("mousedown",()=>{
//     if(selectedPoint >= 0) dragging = true;
// })
// window.addEventListener("mouseup",()=>{
//     if(selectedPoint) dragging=false;
// })


function drawGradient(){
    var grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grd.addColorStop(0, "#ADD8E6");
    grd.addColorStop(1, "#87CEEB");

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0,0, canvas.width,canvas.height);
}

function drawPointer(orography){
    if(selectedPoint >= 0 ){
        ctx.beginPath();
        let x = (selectedPoint*canvas.width)/(orography.length-1)
        let y = canvas.height - orography[selectedPoint]
        ctx.fillStyle = "red";
        ctx.arc(x,y, 10, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

    }
}

function generateOrography(rng,width,initFrequencyMultiplier,lacunarity=1,persistence=1,octaves=1,maxAmplitude,offset=0){
    const arr = perlin1D(width,octaves,lacunarity,persistence,rng,initFrequencyMultiplier,maxAmplitude);
    const minArr = Math.min(...arr) + maxAmplitude + offset;
    return arr.map((x)=>x+minArr);
}


function drawMountains(orography,color='green'){
    ctx.fillStyle =color;
    ctx.beginPath();
    ctx.moveTo(canvas.width, canvas.height);
    ctx.lineTo(0,canvas.height);
    
    for(let i=0; i<orography.length; i++){
        let x = canvas.width/(orography.length-1);
        ctx.lineTo(i*x, canvas.height-scaleFactor*orography[i]);
    }
    ctx.closePath();
    ctx.fill();
}


function drawClouds(wz){
    let maxAlt = Math.max(...orography)*scaleFactor;
    let yRes = (canvas.height - maxAlt)/vertRes
    for(let z=0; z<vertRes;z++){
        wz[z].map((w,i)=> w > 0.15 ? i : -1).filter((x)=>x>0).forEach((i)=>{
            let x = (i*canvas.width)/(orography.length-1)
            let y = (canvas.height - maxAlt - z*yRes)
            ctx.fillStyle ="white";
            ctx.fillRect(x,y-50,canvas.width/(orography.length - 1),50)
        });
        
    }
}

const Lx = 70000;
const Lz = 15000;
const zres = 50;

function update(N,u,seed){
    const rng = seedrandom(seed);
    let N2 = N*N;
    const mainOrthog =  generateOrography(rng,200,1,2,0.6,4,200,100);
    const {wz} = spectralSolve(mainOrthog,Lx,Lz,zres,N2,u);
    return {orthogs:[
        generateOrography(rng,200,1,2.5,0.6,1,200),
        generateOrography(rng,200,1,2.5,0.8,2,215),
        mainOrthog
    ],wz}


}

function draw(orthograries,colors,wz){
    

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Background Gradient 
    drawGradient();
    // drawMountains(bg2,'green');
    // drawMountains(bg1,'darkgreen');
    for(let i=0;i<orthograries.length;i++){
        drawMountains(orthograries[i],colors[i]);
    }


    //drawClouds(wz);

}
const {orthogs,wz} = update(nslider.value,speedslider.value,seedInput.value);
console.log(wz)
const colors = ['darkgreen','darkgreen','green'];
draw(orthogs,colors,null);