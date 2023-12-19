import { readFileSync } from 'fs';
import * as v8 from "v8";

interface Coordinate {
  x: number;
  y: number;
}

export const Main = () => {
  const file = readFileSync('src/Day18/input.txt', 'utf8')
    .split('\n')
    .filter((x) => x !== '');

  makeHoles(file);
};

const makeHoles = (file: string[]) => {
  let holeDirections = [];
  for (let i = 0; i < file.length; i++) {
    let directions = file[i].split(' (', 1)[0].split(' ');
    let [direction, distance] = directions;
    holeDirections.push([direction, parseInt(distance)]);
  }
  //Establish the current coordinate of 0,0
  let currentCoordinate: Coordinate = { x: 0, y: 0 };

  let initalGrid = [[]];

  //Go through
  for (let i = 0; i < holeDirections.length; i++) {
    //Get the current direction
    let [direction, distance] = holeDirections[i];

    //Get the current x direction and determine where we're going
    if (direction === 'R') {
      //Look ahead to see if the row we're currently in can accommodate us
      if (
        initalGrid[currentCoordinate.y].length <=
        currentCoordinate.x + distance
      ) {
        console.log("Current coordinate", currentCoordinate.x, currentCoordinate.y);
        console.log("Distance", distance);

        //Let available columns
        let availableColumns = initalGrid[currentCoordinate.y].length - currentCoordinate.x -1;
        let neededColumns = distance - availableColumns;
        console.log("Available columns", availableColumns, "Needed columns", neededColumns);
        //Add the number of columns we need
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
      //For each step we take, add a # hole to the grid
      for (let j = 0; j < distance; j++) {
        initalGrid[currentCoordinate.y][startingX + j] = '#';
      }
      //Move the current coordinate right
      currentCoordinate.x === 0 && currentCoordinate.y === 0
        ? (currentCoordinate.x += distance - 1)
        : (currentCoordinate.x += distance);
    }

    if (direction === 'L') {
      let startingX = currentCoordinate.x - 1;

      //If we're going to the left we need to make sure we have enough columns in the row to accommodate us
      if (startingX < 0) {
        //Add the number of columns we need to every row in the grid
        for (let j = 0; j < initalGrid.length; j++) {
          //Add the number of columns we need
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
      //Move the current coordinate left
      currentCoordinate.x -= distance;
    }

    if (direction === 'U') {
      //If we're going up, we need to make sure we have enough rows to accommodate us

      //Available rows
      let availableRows = initalGrid.length - currentCoordinate.y;
      if (currentCoordinate.y - distance <= 0) {
        //Available rows
        let availableRows = currentCoordinate.y;
        let neededRows = distance - availableRows;

        console.log("Available rows", availableRows, "Needed rows", neededRows);
        for (let j = 0; j < neededRows; j++) {
          initalGrid.unshift(new Array(initalGrid[0].length).fill('.'));
        }
        console.log("Moving up to row 0", currentCoordinate.y, distance);
        currentCoordinate.y =  distance
      }

      let startingY = currentCoordinate.y - 1;
      for (let j = 0; j < distance; j++) {
        initalGrid[startingY - j][currentCoordinate.x] = '#';
      }
      //Move the current coordinate up
      currentCoordinate.y -= distance;
    }

    if (direction === 'D') {
      //If we're going down, we need to make sure we have enough rows to accommodate us
      if (
        initalGrid.length <= currentCoordinate.y + distance ||
        initalGrid[currentCoordinate.y + distance] === undefined
      ) {
        //Add the number of rows we need, each with the number of columns we need
        for (let j = 0; j < distance; j++) {
          initalGrid.push(new Array(initalGrid[0].length).fill('.'));
        }
      }
      //Let start
      let startingY = currentCoordinate.y + 1;

      for (let j = 0; j < distance; j++) {
        initalGrid[startingY + j][currentCoordinate.x] = '#';
      }
      //Move the current coordinate down
      currentCoordinate.y += distance;
    }
   //Log current row
  }


  //Flood fill the grid
  floodFillIterative(initalGrid, initalGrid[0].length - 134 , 50 );

  //Log each row of the grid
  for (let i = 0; i < initalGrid.length; i++) {
    console.log(initalGrid[i].join(''));
  }
  //Count the number of holes
  let holeCount = 0;
  for (let i = 0; i < initalGrid.length; i++) {
    for (let j = 0; j < initalGrid[i].length; j++) {
      if (initalGrid[i][j] === '#') {
        holeCount++;
      }
    }
  }

  console.log("Hole count", holeCount);


};


const floodFillIterative = (grid, x, y) => {
  let stack = [[x, y]];

  while (stack.length > 0) {
    let [cx, cy] = stack.pop();

    if (cx < 0 || cx >= grid[0].length || cy < 0 || cy >= grid.length || grid[cy][cx] !== '.') {
      continue;
    }

    grid[cy][cx] = '#';

    stack.push([cx + 1, cy]);
    stack.push([cx - 1, cy]);
    stack.push([cx, cy + 1]);
    stack.push([cx, cy - 1]);
  }
};
