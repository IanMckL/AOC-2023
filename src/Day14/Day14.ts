import { readFileSync } from 'fs';

export const Main = () => {
  const start = performance.now();

  //Load input
  const file = readFileSync('src/Day14/input.txt', 'utf8')
    .split('\n')
    .filter((line) => line !== '');

  const transposed = transpose2DArray(file);
  const shiftedGrid = shiftItems(transposed);
  const calculatedDistance = calculateDistanceEnd(shiftedGrid);
};

const transpose2DArray = (array: string[]): string[][] => {
  const rows = array.length;
  const cols = array[0].length;

  const newMatrix = new Array(cols).fill(0).map(() => new Array(rows).fill(0));
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      newMatrix[col][row] = array[row][col];
    }
  }

  return newMatrix;
};

const shiftItems = (grid: string[][]) => {
  let newGrid: string[][] = [];
  //Construct a new grid
  iLoop: for (let i = 0; i < grid.length; i++) {
    let row = grid[i];
    let newRow: string[] = [];
    let splitRow = row.join('').split('#');
    for (let j = 0; j < splitRow.length; j++) {
      let item = splitRow[j];
      let numberOfOs = item.split('').filter((char) => char === 'O').length;
      let numberOfPeriods = item
        .split('')
        .filter((char) => char === '.').length;
      let newString = 'O'.repeat(numberOfOs) + '.'.repeat(numberOfPeriods);
      newRow.push(newString);
    }
    //Insert a # between each item in the row
    let splitWithHash = newRow.join('#');
    newGrid.push(splitWithHash.split(''));
  }
  return newGrid;
};

const calculateDistanceEnd = (grid: string[][]) => {
  //Initialize a total distance
  let totalDistance = 0;
  //loop through each row
  for (let i = 0; i < grid.length; i++) {
    let row = grid[i];
    //loop through each item in the row
    for (let j = 0; j < row.length; j++) {
      let item = row[j];
      //If the item is an O, calculate the distance from the end
      if (item === 'O') {
        let distanceToEnd = row.length - j;
        totalDistance += distanceToEnd;
      }
    }
  }

  console.log(totalDistance);

  return totalDistance;


}
