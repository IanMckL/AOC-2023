import { readFileSync } from 'fs';

interface Coordinate {
  x: number;
  y: number;
}

export const Main = () => {
  const file = readFileSync('src/Day3/input.txt', 'utf8')
    .split('\n')
    .filter((x) => x !== '');
  const solution = sumArray(getValidNumbers(makeGrid(file)));

  console.log(solution);
};

const makeGrid = (input: string[]): string[][] => {
  let grid: string[][] = [];

  for (let i = 0; i < input.length; i++) {
    grid.push(input[i].split(''));
  }

  return grid;
};

const getValidNumbers = (grid: string[][]): number[] => {
  let validNumbers: number[] = [];

  //Loop through each row
  for (let i = 0; i < grid.length; i++) {
    //loop through each item in the row
    for (let j = 0; j < grid[i].length; j++) {
      let char = grid[i][j];
      if (char === '.') continue;
      //Test if char is number
      if (isNaN(Number(char))) continue;
      //Get the index of all characters leading up to the next period
      let nextNaNIndex = grid[i].slice(j).findIndex((x) => isNaN(Number(x)));
      //Get the number of characters leading up to the next period
      let numberLength =
        nextNaNIndex === -1 ? grid[i].slice(j).length : nextNaNIndex;
      //Iterate through each character in the number
      let numberCoordinates: Coordinate[] = [];
      let numberString = '';
      for (let k = 0; k < numberLength; k++) {
        numberCoordinates.push({ x: j + k, y: i });
        numberString += grid[i][j + k];
      }
      let symbolFound = false;
      //Iterate through each coordinate in the number
      for (let k = 0; k < numberCoordinates.length; k++) {
        let coordinate = numberCoordinates[k];
        let adjacentNumbers = getAdjacentNumbers(grid, coordinate);
        //If entries in adjacentNumbers are not . AND is not a number we assume it to be a symbol
        if (adjacentNumbers.some((x) => x !== '.' && isNaN(Number(x)))) {
          symbolFound = true;
          break;
        }
      }
      if (symbolFound) validNumbers.push(Number(numberString));

      j += numberLength;
    }
  }
  return validNumbers;
};

const getAdjacentNumbers = (
  grid: string[][],
  coordinate: Coordinate,
): string[] => {
  //Initialize definition of adjacent
  let adjacent: Coordinate[] = [
    { x: coordinate.x - 1, y: coordinate.y - 1 },
    { x: coordinate.x, y: coordinate.y - 1 },
    { x: coordinate.x + 1, y: coordinate.y - 1 },
    { x: coordinate.x - 1, y: coordinate.y },
    //Diagonal coordinates
    { x: coordinate.x + 1, y: coordinate.y },
    { x: coordinate.x - 1, y: coordinate.y + 1 },
    { x: coordinate.x, y: coordinate.y + 1 },
    { x: coordinate.x + 1, y: coordinate.y + 1 },
  ];
  //Get the value of each adjacent coordinate
  let adjacentValues = adjacent.map((x) => getCoodinateValue(grid, x));
  //Filter out empty values
  adjacentValues = adjacentValues.filter((x) => x !== '');

  return adjacentValues;
};

const getCoodinateValue = (
  grid: string[][],
  coordinate: Coordinate,
): string => {
  if (coordinate.x < 0 || coordinate.x > grid[0].length - 1) return '';
  if (coordinate.y < 0 || coordinate.y > grid.length - 1) return '';
  return grid[coordinate.y][coordinate.x];
};
const sumArray = (array: number[]): number => {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
};
