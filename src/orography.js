import {ifft,fft,complex,pi, pow,add,multiply,sqrt,exp,divide} from 'mathjs';
const baseHeight = 300;

function mToPixels(v){
    return v/50
}
function pixelsToM(v){
    return v*50
}


function fftfreq(n,dt=1){
    let f = Array(n).fill(0)
    let df = 1/(dt*n);
    let ny = df*n/2;
    for (let k = df,i=1; k<=ny ;k+=df,i++){
        f[i] = k;
        if (n != (n-i)){
            f[n-i] = -k;
        }
    }
    // Returns k vector 
    return f
}

function spectralSolve(orographyM,spatialWidth,verticalHeight,verticalResolution,N2,u0){
    let k_mag = fft(orographyM);
    let k = fftfreq(orographyM.length,spatialWidth/orographyM.length);
    k_mag[0] = complex(0);
    let m2 = k.map((x) => add(N2/(u0*u0), multiply(-1,pow(x,2))));
    let m = m2.map((x,i) => multiply(complex(sqrt(x)),(2*((k[i] > 0)|(x<0))-1)));
    let wsurf = k_mag.map((x,i) => multiply(complex('1i'),multiply(k[i],multiply(u0,x))));
    let wz = [wsurf];
    let uz = [];
    for(let zi=1; zi<verticalResolution;zi++){
        let z = zi*verticalHeight/verticalResolution;
        let w = []
        // let u = [];
        for(let mi=0; mi < m.length; mi++){
            let w_zm = multiply(wsurf[mi],exp(multiply(complex('1i'), multiply(m[mi],z))))
            //let u_zm = multiply(-1,divide(multiply(m[mi],w_zm),k[mi]))   
            w.push(w_zm)
            // if (k[mi] == 0 | m[mi].abs() == 0){
            //     u.push(0)
            // }else{
            //     u.push(u_zm)
            // }
        }
        wz.push(ifft(w).map((x)=>x.re));
        // uz.push(ifft(u).map((x)=>x.re));
    }
    return {wz:wz}
}

export {spectralSolve,fftfreq,pixelsToM,mToPixels}