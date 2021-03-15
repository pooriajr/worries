const canvas = document.querySelector('canvas'); 
const ctx = canvas.getContext('2d'); 
ctx.fillStyle = 'white'

const width = 150;
const height = 150;

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
  let options = []
  if (grid[x , y + 1] != 1) { 
    _.times(100, () => { options.push([x , y + 1]) })
  }
  if (grid[x + 1, y + 1] != 1) { options.push([x + 1, y + 1]) }
  if (grid[x - 1, y + 1] != 1) { options.push([x - 1, y + 1]) }

  randomPick = options[_.random(options.length - 1)]

  console.log(randomPick)
  grid[randomPick[1]][randomPick[0]] = 1
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

function paint(event) {
  grid[event.layerY][event.layerX] = 1
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
  paint(event)
});

window.addEventListener('keypress', handleKeyPress)

function handleKeyPress(e){
  const offset = width / 2
  console.log(keys[e.key])
  if (keys[e.key]){
    keys[e.key].forEach((row, y) => {
      row.forEach((point, x) => {
        grid[y + 10][x + offset] = point
      })
    })
    drawSand()
  }
}
