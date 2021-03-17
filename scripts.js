const { fonts, renderPixels } = require('js-pixel-fonts');
const _ = require('lodash')

const canvas = document.querySelector('canvas'); 
const ctx = canvas.getContext('2d'); 
ctx.fillStyle = 'white'

const width = 300;
const height = 300;

const grid = new Array(height)
for(let y = 0; y < height; y++) {
  grid[y] = (new Array(width))
}

const tickInterval = window.setInterval(tick, 60);

function shiftSand(){
  let y = height - 1
  while(y >= 0) {
    let x = width - 1
    while(x >= 0) {
      if (grid[y][x] == 1) {
        shiftGrain(x,y)
      }
      x--
    }
    y--
  }
}

function shiftGrain(x,y){
  if (y === height - 1) { return }
  else if (hasGrainsUnder(x,y)) { return } 
  else { randomShift(x,y) }
}

function randomShift(x,y){
  let options = {
    down: [x, y + 1],
    left: [x - 1, y + 1],
    right: [x + 1, y + 1]
  }

  if (grid[y + 1][x])     { options.down = null }
  if (grid[y + 1][x + 1]) { options.right = null }
  if (grid[y + 1][x - 1]) { options.left = null }

  r = _.random(1000)

  let shiftCoord
  if (options.down && r <= 998) {
    shiftCoord = options.down
  } else if (options.left && options.right) {
    shiftCoord = (r % 2 ? options.left : options.right)
  } else if (options.left && !options.right) { 
    shiftCoord = options.left 
  } else if (options.right && !options.left) { 
    shiftCoord = options.right 
  }

  grid[shiftCoord[1]][shiftCoord[0]] = 1
  grid[y][x] = null
}

function hasGrainsUnder(x,y) {
  return grid[y + 1][x] && grid[y + 1][x + 1] && grid[y + 1][x - 1]
}

function clearCanvas(){
  ctx.clearRect(0, 0, width, height);
}

function drawSand(){
  for(let x = 0; x < width; x++) {
    for(let y = 0; y < height; y++) {
      if (grid[y][x]) {
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
}

function addSand(x,y){
  grid[y][x] = 1
}

function tick(){
  //update model
  shiftSand()
  //update view
  clearCanvas()
  drawSand()
}

canvas.addEventListener('click', function(event) {
  let clickCoords = getMousePos(canvas, event)
  grid[Math.floor(clickCoords.y)][Math.floor(clickCoords.x)] = 1
});

// window.addEventListener('keypress', handleKeyPress)

// function addLetterToGrid(letter, coord) {
//   keys[letter].forEach((row, y) => {
//     row.forEach((point, x) => {
//       grid[coord[1] + y][coord[0] + x] = point
//     })
//   })
// }

// function handleKeyPress(e){
//   const coord = [width *.5 , height * .2]
//   if (keys[e.key]){
//     addLetterToGrid(e.key, coord)
//   }
//   drawSand()
// }

function  getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
    scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

  return {
    x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
    y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
  }
}

function inputWorry(){
  let worry = window.prompt("What's got you worried?")
  addPixelArrayToGrid(renderPixels(worry, fonts.sevenPlus))
  drawSand()
}

document.getElementById('inputWorry').addEventListener('click', inputWorry)

function addPixelArrayToGrid(array){
  let coord = [10, 10]
  array.forEach((row, y) => {
    row.forEach((point, x) => {
      grid[coord[1] + y][coord[0] + x] = point
    })
  })
}

addPixelArrayToGrid(renderPixels("What's got you worried?", fonts.sevenPlus))

function addStringToGrid(string){
  let letters = filterValidLetters(string)
  letters.forEach((letter, i)=> {
    addLetterToGrid(letter, [5 * i , 10])
  })
}

function filterValidLetters(string){
  return string.split('').filter(letter => keys[letter])
}
