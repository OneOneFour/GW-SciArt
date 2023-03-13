

function perlinNoise(width,octaves,lacunarity,persistence,rng,initFrequencyMultiplier=1,initAmplitude=1){
    let frequency = (2*initFrequencyMultiplier)/width;
    let amplitude = initAmplitude;
    let noise = new Array(width).fill(0);
    for(let i=0; i< octaves;i++){
        // Generate noise vectors
        let gradients = new Array(Math.ceil(frequency*width)+1).fill(0).map((x)=>rng()*2-1);
        for(let xi = 0; xi < width;xi++){
            noise[xi] += amplitude*noise1D(xi*frequency,gradients);
        }
        amplitude *= persistence;
        frequency *= lacunarity;
    }
    return noise;
}
function noise1D(x,gradients){

    const x_anchor = Math.floor(x);
    const frac = x-x_anchor;
    const v1 = gradients[x_anchor];
    const v2 = gradients[x_anchor+1];
    const d1 = frac*v1;
    const d2 = -(1-frac)*v2;

    return d1+smoothstep(frac)*(d2-d1)
}

function smoothstep(t){
    if(t < 0) return 0;
    if(t > 1) return 1;
    return 3*t*t - 2*t*t*t;
}
export default perlinNoise;