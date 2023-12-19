import { readFileSync } from 'fs';
import * as v8 from 'v8';

interface Coordinate {
  x: number;
  y: number;
}

export const Main = () => {
  let start = performance.now();
  const file = readFileSync('src/Day18/input.txt', 'utf8')
    .split('\n')
    .filter((x) => x !== '');

  let holeCount = findHoleCount(file);
  let end = performance.now();
  console.log(`Hole Count: ${holeCount}`);
  console.log(`Time to complete: ${end - start}ms`);
};
const directionMarkerConverter = (directionMarker: string) => {
  if (directionMarker === '0') {
    return 'R'
  }
  if (directionMarker === '1') {
    return 'D'
  }
  if (directionMarker === '2') {
    return 'L'
  }
  if (directionMarker === '3') {
    return 'U'
  }
}
const findHoleCount = (file: string[]) => {
  let holeDirections = [];
  for (let i = 0; i < file.length; i++) {
    let hex = file[i].split(' (')[1]
    let directionMarker = hex.slice(6,7)
    let convertedDirectionMarker = directionMarkerConverter(directionMarker)
    let slicedHex = hex.slice(1, 6)
    let parsedHex = parseInt(slicedHex, 16)
    console.log(parsedHex)
   holeDirections.push([convertedDirectionMarker, parsedHex]);
  }


  let currentCoordinate: Coordinate = { x: 0, y: 0 };

  let initalGrid = [[]];

  for (let i = 0; i < holeDirections.length; i++) {
    console.log(i)
    let [direction, distance] = holeDirections[i];

    if (direction === 'R') {
      if (
        initalGrid[currentCoordinate.y].length <=
        currentCoordinate.x + distance
      ) {
        let availableColumns =
          initalGrid[currentCoordinate.y].length - currentCoordinate.x - 1;
        let neededColumns = distance - availableColumns;
        for (let j = 0; j < initalGrid.length; j++) {
          for (let k = 0; k < neededColumns; k++) {
            initalGrid[j].push('.');
          }
        }
      }

      let startingX =
        currentCoordinate.x === 0 && currentCoordinate.y === 0
          ? currentCoordinate.x
          : currentCoordinate.x + 1;
      for (let j = 0; j < distance; j++) {
        initalGrid[currentCoordinate.y][startingX + j] = '#';
      }
      currentCoordinate.x === 0 && currentCoordinate.y === 0
        ? (currentCoordinate.x += distance - 1)
        : (currentCoordinate.x += distance);
    }

    if (direction === 'L') {
      let startingX = currentCoordinate.x - 1;
      if (startingX < 0) {
        for (let j = 0; j < initalGrid.length; j++) {
          for (let k = 0; k < distance; k++) {
            initalGrid[j].unshift('.');
          }
        }
        currentCoordinate.x = 0 + distance;
      }
      startingX = currentCoordinate.x - 1;

      for (let j = 0; j < distance; j++) {
        initalGrid[currentCoordinate.y][startingX - j] = '#';
      }
      currentCoordinate.x -= distance;
    }

    if (direction === 'U') {
      if (currentCoordinate.y - distance <= 0) {
        let availableRows = currentCoordinate.y;
        let neededRows = distance - availableRows;
        for (let j = 0; j < neededRows; j++) {
          initalGrid.unshift(new Array(initalGrid[0].length).fill('.'));
        }
        currentCoordinate.y = distance;
      }

      let startingY = currentCoordinate.y - 1;
      for (let j = 0; j < distance; j++) {
        initalGrid[startingY - j][currentCoordinate.x] = '#';
      }
      currentCoordinate.y -= distance;
    }

    if (direction === 'D') {
      if (
        initalGrid.length <= currentCoordinate.y + distance ||
        initalGrid[currentCoordinate.y + distance] === undefined
      ) {
        for (let j = 0; j < distance; j++) {
          initalGrid.push(new Array(initalGrid[0].length).fill('.'));
        }
      }
      let startingY = currentCoordinate.y + 1;

      for (let j = 0; j < distance; j++) {
        initalGrid[startingY + j][currentCoordinate.x] = '#';
      }
      currentCoordinate.y += distance;
    }
  }
  floodFillIterative(initalGrid, initalGrid[0].length - 134, 50);

  let holeCount = 0;
  for (let i = 0; i < initalGrid.length; i++) {
    for (let j = 0; j < initalGrid[i].length; j++) {
      if (initalGrid[i][j] === '#') {
        holeCount++;
      }
    }
  }

  return holeCount;
};

const floodFillIterative = (grid, x, y) => {
  let stack = [[x, y]];

  while (stack.length > 0) {
    let [cx, cy] = stack.pop();

    if (
      cx < 0 ||
      cx >= grid[0].length ||
      cy < 0 ||
      cy >= grid.length ||
      grid[cy][cx] !== '.'
    ) {
      continue;
    }

    grid[cy][cx] = '#';

    stack.push([cx + 1, cy]);
    stack.push([cx - 1, cy]);
    stack.push([cx, cy + 1]);
    stack.push([cx, cy - 1]);
  }
};
