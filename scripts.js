const canvas = document.querySelector('canvas'); 
const ctx = canvas.getContext('2d'); 
ctx.fillStyle = 'white'

const scale = 100;
const width = scale;
const height = scale;

const grid = new Array(height)
for(let y = 0; y < height; y++) {
  grid[y] = (new Array(width))
}

const tickInterval = window.setInterval(tick, 30);
window.setTimeout(() => {window.clearInterval(tickInterval)}, 50000)

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
  let options = []
  if (grid[x , y + 1] != 1) { options.push([x , y + 1]) }
  if (grid[x + 1, y + 1] != 1) { options.push([x + 1, y + 1]) }
  if (grid[x - 1, y + 1] != 1) { options.push([x - 1, y + 1]) }

  randomPick = options[getRandomInt(options.length)]

  grid[randomPick[1]][randomPick[0]] = 1
  grid[y][x] = null
}

function hasGrainsUnder(x,y) {
  return grid[y + 1][x] && grid[y + 1][x + 1] && grid[y + 1][x - 1]
}

function randomHorizontalShift(){
  const options = [-1,0,0,0,0,0,1]
  return options[getRandomInt(options.length)]
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function clearCanvas(){
  ctx.clearRect(0, 0, width, height);
}

function drawSand(){
  for(let x = 0; x < width; x++) {
    for(let y = 0; y < height; y++) {
      if (grid[y][x]) {
        ctx.fillRect(x,y, 1, 1);
      }
    }
  }
}

function addSand(x,y){
  grid[y][x] = 1
}

function tick(){
  console.log(grid);
  //update model
  addSand(width * .5, height * .1)
  shiftSand()
  //update view
  clearCanvas()
  drawSand()
}
