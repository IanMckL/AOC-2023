import { readFileSync } from 'fs';
import { makeGrid } from '../Day3/Day3.js';
import { memoize } from '../Day12/Day12.js';

export const Main = () => {
  const start = performance.now();

  const file = readFileSync('src/Day16/input.txt', 'utf8')
    .split('\n')
    .filter((x) => x !== '');

  const grid = makeGrid(file);

  const perimeterCoordinates = getGridPerimeterCoordinates(grid);
  let topValue = 0;
  //Loop through perimeter coordinates
  for (let i = 0; i < perimeterCoordinates.length; i++) {
    let visited = new Set<string>();
    let xDirection = 0;
    let yDirection = 0;
    //Left column
    if (perimeterCoordinates[i][0] === 0) {
      xDirection = 1;
    }
    //Right column
    if (perimeterCoordinates[i][0] === grid[0].length - 1) {
      xDirection = -1;
    }

    //Top row
    if (perimeterCoordinates[i][1] === 0) {
      yDirection = 1;
    }

    //Bottom row
    if (perimeterCoordinates[i][1] === grid.length - 1) {
      yDirection = -1;
    }

    moveThroughGrid(
      grid,
      perimeterCoordinates[i][0],
      perimeterCoordinates[i][1],
      xDirection,
      yDirection,
      visited,
    );
    let parsedSet = coordinatesSet(visited);
    if (parsedSet.size > topValue) {
      topValue = parsedSet.size;
    }
  }
  console.log(topValue);
  const end = performance.now();
  console.log(`Day 16 took ${end - start} milliseconds`);
};

const coordinatesSet = (inputSet: Set<string>): Set<string> => {
  let coordinates = new Set<string>();
  inputSet.forEach((value) => {
    coordinates.add(value.split(',').slice(0, 2).join(','));
  });
  return coordinates;
};

const getGridPerimeterCoordinates = (grid: string[][]): number[][] => {
  let perimeterCoordinates: number[][] = [];
  //Get top row
  for (let i = 0; i < grid[0].length; i++) {
    perimeterCoordinates.push([i, 0]);
  }
  //Get bottom row
  for (let i = 0; i < grid[grid.length - 1].length; i++) {
    perimeterCoordinates.push([i, grid.length - 1]);
  }
  //Get left column but not top and bottom
  for (let i = 1; i < grid.length - 1; i++) {
    perimeterCoordinates.push([0, i]);
  }
  //Get right column but not top and bottom
  for (let i = 1; i < grid.length - 1; i++) {
    perimeterCoordinates.push([grid[0].length - 1, i]);
  }
  return perimeterCoordinates;
};

const moveThroughGrid = (
  grid: string[][],
  x: number,
  y: number,
  xDirection: number,
  yDirection: number,
  visited: Set<string>,
) => {
  //Check if y exists
  if (!grid[y]) {
    return;
  }
  if (!grid[y][x]) {
    return;
  }

  //If we've visited this tile before, return
  if (visited.has(`${x},${y},${xDirection},${yDirection}`)) {
    return;
  }

  visited.add(`${x},${y},${xDirection},${yDirection}`);

  if (grid[y][x] === '.') {
    if (
      x + xDirection > grid[0].length ||
      x + xDirection < 0 ||
      y + yDirection > grid.length ||
      y + yDirection < 0
    ) {
      return;
    }
    return moveThroughGrid(
      grid,
      x + xDirection,
      y + yDirection,
      xDirection,
      yDirection,
      visited,
    );
  }
  if (grid[y][x] === '/') {
    if (xDirection === 1) {
      moveThroughGrid(grid, x, y - 1, 0, -1, visited);
      return;
    }
    if (xDirection === -1) {
      moveThroughGrid(grid, x, y + 1, 0, 1, visited);
      return;
    }
    if (yDirection === -1) {
      moveThroughGrid(grid, x + 1, y, 1, 0, visited);
      return;
    }
    if (yDirection === 1) {
      return moveThroughGrid(grid, x - 1, y, -1, 0, visited);
    }
  }

  if (grid[y][x] === '\\') {
    if (xDirection === 1) {
      moveThroughGrid(grid, x, y + 1, 0, 1, visited);
      return;
    }
    if (xDirection === -1) {
      moveThroughGrid(grid, x, y - 1, 0, -1, visited);
      return;
    }
    if (yDirection === -1) {
      moveThroughGrid(grid, x - 1, y, -1, 0, visited);
      return;
    }
    if (yDirection === 1) {
      moveThroughGrid(grid, x + 1, y, 1, 0, visited);
      return;
    }
  }

  if (grid[y][x] === '|') {
    if (xDirection === 1 || xDirection === -1) {
      moveThroughGrid(grid, x, y + 1, 0, 1, visited);
      moveThroughGrid(grid, x, y - 1, 0, -1, visited);
      return;
    }
    if (yDirection === -1) {
      moveThroughGrid(grid, x, y - 1, 0, -1, visited);
      return;
    }
    if (yDirection === 1) {
      moveThroughGrid(grid, x, y + 1, 0, 1, visited);
      return;
    }
  }

  if (grid[y][x] === '-') {
    if (yDirection === 1 || yDirection === -1) {
      moveThroughGrid(grid, x + 1, y, 1, 0, visited);
      moveThroughGrid(grid, x - 1, y, -1, 0, visited);
      return;
    }
    if (xDirection === -1) {
      moveThroughGrid(grid, x - 1, y, -1, 0, visited);
      return;
    }
    if (xDirection === 1) {
      moveThroughGrid(grid, x + 1, y, 1, 0, visited);
      return;
    }
  }
};
