function bulge(x,xmax){
    if (x >= xmax) return 0;
    return (xmax*xmax-x*x)/(xmax*xmax);
}
export {bulge};