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

let w;
let h
let pix = 1
let s, c, pg2, img, sh
let i, f, k
let frameMod
let blurShader

let seed1
let borderStr
let uOctave
let border
let blockColor, blockColor2, blockColor3
let stopCount = 1
let far
let blockW, blockH
let yatayChooser
let sChooser
let mapChooser
let ellipseChooser
let akChooser
let dirChooser
let whEdgeX
let probb
let borderBox
let move
let al
let m
let sMult = 1
let maskTexture;
let bb
let bolunme
let intDir, intDir2
let zoom = 1.0;
let displaceText
let mousePos
let nscale
let disP, u_boy

function preload() {
  seed1 = 99999999 * random()
  // seed1 = 58530442.241276726
  // seed1 = 9838593.354736457

  // seed1 = 67879773.04116778



  sh = loadShader("pix.vert", "pix.frag");
}

function setup() {


  w = min(windowWidth, windowHeight)
  h = min(windowWidth, windowHeight)

  c = createCanvas(w, h, WEBGL)
  pixelDensity(pix)
  f = createGraphics(w, h)
  f.pixelDensity(pix)
  // f.colorMode(HSB, 360, 100, 100, 255)

  f.background(0, 0, 10)

  pg2 = createGraphics(w, h)
  pg2.pixelDensity(pix)
  pg2.noStroke()

  img = createGraphics(w, h)
  img.pixelDensity(pix)
  img.imageMode(CENTER)
  img.colorMode(HSB, 360, 100, 100, 1)
  img.rectMode(CENTER)

  maskTexture = createGraphics(w, h);
  maskTexture.pixelDensity(pix);



  console.log(seed1)
  noiseSeed(seed1)
  randomSeed(seed1)


  let frArr = [25, 50, 75, 50, 25, 50, 75, 50, 50, 75] ///Scene change intervals


  frameMod = frArr[floor(random(frArr.length))] * 2

  frameMod = random([250, 250, 300, 200, 400, 500, 250, 300])

  far = 60

  frameRate(far)

  let rR = random([0, 255])
  let gG = random([0, 255])
  let bB = random([0, 255])

  let initialRGB = random(["monoBlack", "monoBlack", "Red", "monoBlack", "monoBlack", "Red"])
  let secondRGB = random(["monoWhite", "monoBlack", "Red", "Yellow", "Cyan", "Blue"])

  // initialRGB = "monoBlack"

  secondRGB = "monoBlack"

  ///monoChrome
  if (initialRGB == "monoBlack") {
    rR = 0
    gG = 0
    bB = 0
  } else if (initialRGB == "monoWhite") {
    ///white
    rR = 255
    gG = 255
    bB = 255
  } else if (initialRGB == "Red") {
    ///////Red
    rR = 255
    gG = 0
    bB = 0
  } else if (initialRGB == "Yellow") {
    ///////Yellow
    rR = 255
    gG = 255
    bB = 0
  } else if (initialRGB == "Cyan") {
    ///////Cyan
    rR = 0
    gG = 255
    bB = 255
  } else if (initialRGB == "Blue") {
    ///////Blue
    rR = 0
    gG = 0
    bB = 255
  }

  f.push();
  f.rectMode(CENTER)
  let sSat = random([80, 80, 80, 80, 80, 0])
  // f.fill(random([0, 220, 120, 180, 280, 330]), sSat, 80);
  f.fill(rR, gG, bB);
  f.rect(w / 2, h / 2, w * 2, h * 2)
  f.pop();







  pad = 0

  hh = random([0, 220, 120, 180, 280, 330])
  ssat = random([80, 80, 80, 80, 80, 0])
  // if (sSat == 0) ssat = 0

  if (secondRGB == "monoBlack") {
    hh = 0
    ssat = 0
    bB = 0
  } else if (secondRGB == "monoWhite") {
    ///white
    hh = 255
    ssat = 255
    bb = 255
  } else if (secondRGB == "Red") {
    ///////Red
    hh = 255
    ssat = 0
    bb = 0
  } else if (secondRGB == "Yellow") {
    ///////Yellow
    hh = 255
    ssat = 255
    bb = 0
  } else if (secondRGB == "Cyan") {
    ///////Cyan
    hh = 0
    ssat = 255
    bb = 255
  } else if (secondRGB == "Blue") {
    ///////Blue
    hh = 0
    ssat = 0
    bb = 255
  }

  // hh = random([0, 255])
  // ssat = random([0, 255])
  // bb = random([0, 255])

  bolunme = random([4, 2, 3, 3, 2, 1])



  console.log("bolunme: " + bolunme)


  createCell(pad, pad, max(w, h), max(w, h), bolunme)


  noiseSeed(seed1)
  randomSeed(seed1)

  probb = random([0, 1])



  akChooser = 1

  dirChooser = random([1.0, 3.0, 3.0, 4.0, 1.0, 3.0, 3.0, 1.0, 1.0, 1.0])

  // dirChooser = 1.0

  let text1 = random([1.0, 0.0, 2.0])
  let text2 = 0.0 //random([0.0, 0.0, 0.0, 1.0, 0.0, 0.0])


  // text1 = 1.0



  let dX = random([1., -1., 0.0, 0.0])
  let dY

  if (dX == 1. || dX == -1) {
    dY = 0.0
  } else {
    dY = random([-1, 1])
  }

  let proD = random([.1, .5])


  displaceText = random([1, 1, 1, 2, 2, 4, 7, 10, 10, 3, 2, 7, 5])


  // displaceText = 1

  intDir = random([-1, 1]) / displaceText

  intDir2 = intDir

  if (random(1) < 0.4) {
    intDir2 = 0.0
  }

  let sorted = random([0, 0, 0, 0, 0, 1])

  let grained = random([0, 0, 0, 0, 0, 1])

  let feed = random([0.0, 0.0, 0.0, 0.2, 0.4, 0.6, 0.0, 0.0])

  let abro = random([0, 0, 0, 0, 1])

  nscale = random([2, 5, 10, 15, 20, 30, 20, 20, 20, 2, 2, 2, 2, 2, 2])

  grained = 0

  syme = random([1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 3.0, 4.0, 6.0, 8.0, 12.0, 1.0, 1.0, 1.0, 1.0,1.0])


  disP = random([0, 0, 0, 0, 0, 0, 1])

  if (disP == 1.0) sorted = 0

  u_boy = 0.0

  console.log("intDir: " + intDir, "intDir2: " + intDir2)

  console.log("feed: " + feed)

  console.log("disP: " + disP)

  console.log("dirChooser: " + dirChooser)

  console.log("text1: " + text1)

  console.log("sorted: " + sorted)


  shader(sh)

  sh.setUniform('resolution', [w * pix, h * pix])
  sh.setUniform('pg', pg2)
  sh.setUniform('pg2', pg2)
  sh.setUniform('img', f)
  sh.setUniform('proD', proD)
  sh.setUniform('asciiTexture', asciiTexture);
  sh.setUniform('maskTexture', maskTexture);
  sh.setUniform('u_intDir', intDir);
  sh.setUniform('u_intDir2', intDir2);
  sh.setUniform('u_sorted', sorted);
  sh.setUniform('u_grain', grained);
  sh.setUniform('u_feed', feed);
  sh.setUniform('u_abro', abro);
  sh.setUniform('u_disP', disP);
  sh.setUniform('u_boy', u_boy);
  sh.setUniform('u_syme', syme);





  sh.setUniform('u_text1', text1)
  sh.setUniform('u_text2', text2)
  sh.setUniform('u_scale', nscale)




  if (dirChooser == 1.0) {
    sh.setUniform('dirX', dX) ///sadece dikeyYatay
    sh.setUniform('dirY', dY)
  } else if (dirChooser == 2.0) {
    sh.setUniform('dirX', random([-1., 1.])) ///sadece kose
    sh.setUniform('dirY', random([-1., 1.]))
  } else if (dirChooser == 3.0) {
    sh.setUniform('dirX', random([-1., 1., 0., 0., 0.])) ////hepsi
    sh.setUniform('dirY', random([-1., 1., 0., 0., 0.]))
  }


  if (akChooser == 1.0) {
    sh.setUniform('ak', 1.)
  } else if (akChooser == 2.0) {
    sh.setUniform('ak', 3.0)
  } else if (akChooser == 3.0) {
    sh.setUniform('ak', 5.0)
  } else if (akChooser == 4.0) {
    sh.setUniform('ak', 10.0)
  }


  sh.setUniform('satOn', dirChooser)




  img.image(f, w / 2, h / 2)

  blockColor = 255
  blockColor2 = 255
  blockColor3 = 255



  blockW = width / 2
  blockH = height / 2
  blockAni = random([0.0, 1.0])

  border = random([0.0, 0.0, 1.0, 1.0, 1.0])


  border = 1.0

  if (border == 1.0) borderStr = "border"
  // yatayChooser = random([0.0, 1.0, 2.0, 3.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0])///0.0 1.0 7.0--

  yatayChooser = random([0.0, 1.0, 0.0, 1.0, 7.0])



  borderBox = random([1, 2])


  move = 0
  al = 255

  m = random([1, 1, 10])

}

function draw() {


  zoom = lerp(zoom, targetZoom, 0.1);

  pg2.noStroke()

  // m  = 10


  pg2.fill(random([0, 255, 127]) / m, random([0, 255, 127]) / m, random([0, 255, 127]) / m)



  if (border == 1.0) {
    pg2.push()
    pg2.fill(blockColor, blockColor2, blockColor3)
    pg2.rectMode(CENTER)
    if (yatayChooser == 0.0) {
      pg2.push()
      pg2.translate(blockW, height / 2)
      pg2.rect(0, 0, width / 10, height)
      pg2.pop()

      pg2.push()
      pg2.translate(blockW - width / 5, height / 2)
      pg2.rect(0, 0, width / 10, height)
      pg2.pop()

      pg2.push()
      pg2.translate(blockW + width / 5, height / 2)
      pg2.rect(0, 0, width / 10, height)
      pg2.pop()

    } else if (yatayChooser == 1.0) {
      pg2.push()
      pg2.translate(width / 2, blockH)
      pg2.rect(0, 0, width, height / 10)
      pg2.pop()

      pg2.push()
      pg2.translate(width / 2, blockH - height / 5)
      pg2.rect(0, 0, width, height / 10)
      pg2.pop()

      pg2.push()
      pg2.translate(width / 2, blockH + height / 5)
      pg2.rect(0, 0, width, height / 10)
      pg2.pop()
      pg2.push()
      let eX = width / 2 + sin(millis() / 1000) * 100
      let eY = height / 2 + noise(millis() / 1000) * 200
      pg2.ellipse(eX, eY, min(width, height) / 2)
      pg2.pop()
    } else if (yatayChooser == 5.0) {
      pg2.push()
      pg2.rectMode(CORNER)
      if (borderBox == 1) {
        pg2.rect(0, 0, width / 2, height)
      } else {
        pg2.rect(0, 0, width, height / 2)
      }


      pg2.pop()
    } else if (yatayChooser == 6.0) {
      pg2.push()
      pg2.rectMode(CORNER)


      if (borderBox == 1) {
        pg2.rect(width / 2, 0, width / 2, height)
      } else {
        pg2.rect(0, height / 2, width, height / 2)
      }
      pg2.pop()
    } else if (yatayChooser == 7.0) {
      pg2.push()

      pg2.rectMode(CENTER)


      if (borderBox == 1) {
        pg2.rect(width / 2, height / 2, width / 3, height)
      } else {
        pg2.rect(width / 2, height / 2, width, height / 3)
      }
      pg2.pop()
    }


    pg2.pop()
  }



  img.image(c, w / 2, h / 2)


  if (frameCount % frameMod == 0) {


    sh.setUniform('ak', random([1., 1., 2.0, 1., 1., 2.0, 3., 1., 1., 1.]) / 2)




    let dX = random([1., -1., 0.0, 0.0])
    let dY

    if (dX == 1. || dX == -1) {
      dY = 0.0
    } else {
      dY = random([-1, 1])
    }

    if (dirChooser == 1.0) {
      sh.setUniform('dirX', dX)
      sh.setUniform('dirY', dY)
    } else if (dirChooser == 2.0) {
      sh.setUniform('dirX', random([-1., 1.]))
      sh.setUniform('dirY', random([-1., 1.]))
    } else if (dirChooser == 3.0) {
      sh.setUniform('dirX', random([-1., 1., 0., 0., 0.]))
      sh.setUniform('dirY', random([-1., 1., 0., 0., 0.]))
    }



    // sh.setUniform('mouse', [mouseX / width, mouseY / height]);





    blockColor = random([255, 127])
    blockColor2 = random([255, 127])
    blockColor3 = random([255, 127])

    blockW = random([width / 2, width / 4, width / 1.3333])
    blockH = random([height / 2, height / 4, height / 1.3333])

    if (borderStr == "border") {
      border = random([1.0, 1.0, 1.0, 1.0, 1.0])
    }
  }

  if (frameCount % frameMod * 2 == 0) {
    createCellPg(pad, pad, w, w, bolunme)
    intDir = intDir * -1;
    sh.setUniform('u_intDir', intDir);
    // sh.setUniform('u_boy', random([0, 0, 0, 0, 1]));
  }

  sh.setUniform('u_time', millis() / 1000.0)
  sh.setUniform('pg', pg2)
  sh.setUniform('img', img)
  sh.setUniform('pg2', pg2)



  mousePos = [mouseX / width, 1.0 - mouseY / height]; // Flip Y-axis if necessary
  sh.setUniform('mouse', mousePos);

  sh.setUniform('scrollOffset', scrollOffset);
  sh.setUniform('zoom', zoom);

  quad(-1, -1, 1, -1, 1, 1, -1, 1)

  // image(asciiTexture, 0,0);

}


function keyPressed() {

  if (key == ' ') {
    stopCount += 1
    if (stopCount % 2 == 0) {
      frameRate(0)
    } else {
      frameRate(far)
    }
  }

  if (key == "s") {
    saveCanvas("strained", "png")
  }

}




function createCell(posX, posY, wid, hei, depth) {

  if (depth > 0) {
    var div = random(0.25, 0.75);



    let intt = random([1, 1.5, 2])
    createCell(posX, posY, wid / 2, hei / 2, depth - intt)
    createCell(posX + wid / 2, posY, wid / 2, hei / 2, depth - intt)
    createCell(posX, posY + hei / 2, wid / 2, hei / 2, depth - intt)
    createCell(posX + wid / 2, posY + hei / 2, wid / 2, hei / 2, depth - intt)


  } else {
    if (random(1) < 0.2) {
      f.noFill()
    } else {
      f.fill(hh, ssat, bb)

    }

    f.stroke(0)
    f.rect(posX, posY, wid, hei)
    f.rect(posX + wid / 2, posY + hei / 2, 1, 1)

    if (random(1) < 0.2) {
      pg2.noFill()
    } else {
      pg2.fill(random([0, 255, 127]), random([0, 255, 127]), random([0, 255, 127]))
    }

    pg2.noStroke()
    pg2.rect(posX, posY, wid, hei)

  }
}



function createCellPg(posX, posY, wid, hei, depth) {
  if (depth > 0) {
    var div = random(0.25, 0.75);



    let intt = random([1, 1.5, 2])
    createCellPg(posX, posY, wid / 2, hei / 2, depth - intt)
    createCellPg(posX + wid / 2, posY, wid / 2, hei / 2, depth - intt)
    createCellPg(posX, posY + hei / 2, wid / 2, hei / 2, depth - intt)
    createCellPg(posX + wid / 2, posY + hei / 2, wid / 2, hei / 2, depth - intt)


  } else {
    if (random(1) < 0.2) {
      pg2.noFill()
    } else {
      pg2.fill(random([0, 255, 127]), random([0, 255, 127, 80]), random([0, 255, 127, 80]))
    }

    pg2.noStroke()
    pg2.rect(posX, posY, wid, hei)
  }
}




let asciiTexture;

let scrollOffset = 0.0;
let targetZoom = 1.0;

function mouseWheel(event) {

  // zoom += event.deltaY * 0.00001;
  // // Clamp zoom to prevent it from becoming too small or negative
  // zoom = constrain(zoom, 0.1, 10.0);




  targetZoom += event.deltaY * -0.00001;
  targetZoom = constrain(targetZoom, 0.1, 10.0);



  return false;
}

function mousePressed() {
  targetZoom = 1.0
}