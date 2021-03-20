export function displayText(p5, element, text){
    p5.select(element).html(text);
}

export function displayAsRGB(r, g, b){
    return `R: ${parseInt(r * 255)} G: ${parseInt(g * 255)} B: ${parseInt(b * 255)}`;
}

export function setSquareCanvas(p5){
    const { windowWidth, windowHeight} = p5;
    return windowWidth > windowHeight ? windowWidth : windowHeight;
}

export function setColorBySpectrum(p5, spectrum){
    const { abs, map } = p5;
    let third = spectrum.length / 3;
    let sumLow = 0;
    let sumMid = 0;
    let sumHigh = 0;
  
    for(let i = 0; i < spectrum.length; i++){
      let bin = spectrum[i];
      bin = isFinite(bin) ? bin : 0;
      if (i < third) {
      sumLow = sumLow + bin;
      } else if (i < 2 * third){
      sumMid = sumMid + bin;
      } else {
      sumHigh = sumHigh + bin;
      }
    }
  
    let averageLow = abs(sumLow / third);
    let averageMid = abs(sumMid / third);
    let averageHigh = abs(sumHigh / third);
    let sumBeat = averageLow + averageHigh/3.5;
    // console.log(sumBeat);
    return map(sumBeat, 80, 120, 0.0, 0.4);
  }