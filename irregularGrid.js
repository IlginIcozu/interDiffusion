var styles = `
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
body {
  overflow: hidden;
  touch-action: none;
  background: #252525;
}
main {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
canvas {
  width: auto !important;
  height: auto !important;
  max-width: 100% !important;
  max-height: 100% !important;
 /* box-shadow: 0px 0px 40px #000000;*/
}
`
var styleSheet = document.createElement("style")
styleSheet.innerText = styles
document.head.appendChild(styleSheet)


function setup() {
  w = windowWidth
  h = windowHeight
  createCanvas(w, h);
  colorMode(HSB, 360, 100, 100, 1)
  // strokeWeight(4);
  pad = 0 //min(w, h) / 10;

  spcX = 25;
  spcY = 25;

  hh = random([0, 220, 120, 180, 280, 330])
  ssat = random([80, 80, 80, 80, 80, 0])

  // rectMode(CENTER)
  // noFill()

  // strokeWeight(2)
}

function draw() {
  background(0)



  createCell(pad, pad, w, w, 6)
  noLoop()
}

function createCell(posX, posY, wid, hei, depth) {
  if (depth > 0) {
    var div = random(0.25, 0.75);

    // if (random(1) < 0.2) {
    //     noFill()
    // } else {
    // fill(random([0, 220, 120, 180, 280, 330]), random([80, 80, 80, 80, 80, 0]), 90)


    // }


    let intt = int(random([1, 2]))
    createCell(posX, posY, wid / 2, hei / 2, depth - intt)
    createCell(posX + wid / 2, posY, wid / 2, hei / 2, depth - intt)
    createCell(posX, posY + hei / 2, wid / 2, hei / 2, depth - intt)
    createCell(posX + wid / 2, posY + hei / 2, wid / 2, hei / 2, depth - intt)


  } else {
    if (random(1) < 0.2) {
      noFill()
    } else {
      fill(hh, ssat, random(60, 90))
    }
    stroke(0)
    rect(posX, posY, wid, hei)
  }
}