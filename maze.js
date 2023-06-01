const canvas = document.querySelector(".maze");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

class Maze {
  constructor(size, rows, columns) {
    this.size = size;
    this.rows = rows;
    this.columns = columns;
    this.grid = [];
    this.stack = [];
  }

  createGrid() {
    for (let r = 0; r < this.rows; r++) {
      let row = [];
      for (let c = 0; c < this.columns; c++) {
        let cell = new Cell(r, c, this.grid, this.size);
        row.push(cell);
      }
      this.grid.push(row);
    }
  }

  depthFirstSearch(start = this.grid[0][0]) {
    start.isVisitied = true;
    let neighbors = start.getNeighbors(this.grid);
    neighbors.forEach(neighbor => {
      if (neighbor && !neighbor.isVisitied) {
        start.removeWall(neighbor);
        this.depthFirstSearch(neighbor);
      }
    });
  }

  generateMaze() {
    this.depthFirstSearch();
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        this.grid[r][c].draw(this.size, this.rows, this.columns);
      }
    }
  }
}

class Cell {
  constructor(rowNum, colNum, mazeGrid, mazeSize) {
    this.rowNum = rowNum;
    this.colNum = colNum;
    this.walls = {
      topWall: true,
      rightWall: true,
      bottomWall: true,
      leftWall: true
    };
    this.mazeGrid = mazeGrid;
    this.mazeSize = mazeSize;
    this.isVisitied = false;
  }

  drawTopWall(x, y, rows, columns) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (this.mazeSize / columns), y);
    ctx.stroke();
  }

  drawRightWall(x, y, rows, columns) {
    ctx.beginPath();
    ctx.moveTo(x + (this.mazeSize / columns), y);
    ctx.lineTo(x + (this.mazeSize / columns), y + (this.mazeSize / rows));
    ctx.stroke();
  }

  drawBottomWall(x, y, rows, columns) {
    ctx.beginPath();
    ctx.moveTo(x, y + (this.mazeSize / rows));
    ctx.lineTo(x + (this.mazeSize / columns), y + (this.mazeSize / rows));
    ctx.stroke();
  }

  drawLeftWall(x, y, rows, columns) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + (this.mazeSize / rows));
    ctx.stroke();
  }

  removeWall(nextCell) {
    let x = this.colNum - nextCell.colNum;
    if (x === 1) {
      this.walls.leftWall = false;
      nextCell.walls.rightWall = false;
    } else if (x === -1) {
      this.walls.rightWall = false;
      nextCell.walls.leftWall = false;
    }
    
    let y = this.rowNum - nextCell.rowNum;
    if (y === 1) {
      this.walls.topWall = false;
      nextCell.walls.bottomWall = false;
    } else if (y === -1) {
      this.walls.bottomWall = false;
      nextCell.walls.topWall = false;
    }
  }
  
  // draws a cell on the maze canvas
  draw(size, rows, columns) {
    let x = (this.colNum * size) / columns;
    let y = (this.rowNum * size) / rows;

    ctx.fillStyle = "black";
    ctx.lineWidth = 1.5;

    if (this.walls.topWall) { this.drawTopWall(x, y, rows, columns); }
    if (this.walls.rightWall) { this.drawRightWall(x, y, rows, columns); }
    if (this.walls.bottomWall) { this.drawBottomWall(x, y, rows, columns); }
    if (this.walls.leftWall) { this.drawLeftWall(x, y, rows, columns); }
  }

  getNeighbors() {
    let grid = this.mazeGrid;
    let row = this.rowNum;
    let col = this.colNum;

    let north = row !== 0 ? grid[row - 1][col] : undefined;
    let east = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
    let south = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
    let west = col !== 0 ? grid[row][col - 1] : undefined;

    // let north = this.rowNum !== 0 ? this.mazeGrid[this.rowNum - 1][this.colNum] : undefined;
    // let east = this.colNum !== this.mazeSize - 1 ? this.mazeGrid[this.rowNum][this.colNum + 1] : undefined;
    // let south = this.rowNum !== this.mazeSize - 1 ? this.mazeGrid[this.rowNum + 1][this.colNum] : undefined;
    // let west = this.colNum !== 0 ? this.mazeGrid[this.rowNum][this.colNum - 1] : undefined;

    return this.shuffle([north, east, south, west]);
  }

  shuffle(neighbors) {
    let currIndex = neighbors.length, randomIndex;
    while (currIndex != 0) {
      randomIndex = Math.floor(Math.random() * currIndex);
      currIndex--;

      [neighbors[currIndex], neighbors[randomIndex]] = [
        neighbors[randomIndex], neighbors[currIndex]];
    }
    return neighbors;
  }
}

let maze = new Maze(width, 80, 80);
maze.createGrid();
maze.generateMaze();