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

  let gearCoordinates = findGearCoordinates(grid);
  let visited = new Set<Coordinate>();
  for (let i = 0; i < gearCoordinates.length; i++) {
    //Get coordinate of gear.
    let coordinate = gearCoordinates[i];
    //Get adjacent numbers
    let adjacentCoordinates = getAdjacentCoordinates(coordinate);
    let numberVisited = new Set<number>();
    for (let j = 0; j < adjacentCoordinates.length; j++) {
      let adjacentCoordinate = adjacentCoordinates[j];
      if (visited.has(adjacentCoordinate)) continue;
      visited.add(adjacentCoordinate);

      //Get the number run
      let numberRun = getNumberRun(grid, adjacentCoordinate);
      if (numberRun !== 0) {
        numberVisited.add(numberRun);
      }
    }
    if (numberVisited.size >= 2) {
      let numbers = Array.from(numberVisited);
      //Multiply the numbers by each other
      let startMuliple = 1;
      for (let j = 0; j < numbers.length; j++) {
        startMuliple *= numbers[j];
      }
      validNumbers.push(startMuliple);
    }
  }

  return validNumbers;
};

const getAdjacentCoordinates = (coordinate: Coordinate): Coordinate[] => {
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

  return adjacent;
};

const getCoordinateValue = (
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

const findGearCoordinates = (grid: string[][]): Coordinate[] => {
  let coordinates: Coordinate[] = [];
  for (let i = 0; i < grid.length; i++) {
    let row = grid[i];
    for (let j = 0; j < row.length; j++) {
      if (row[j] === '*') coordinates.push({ x: j, y: i });
    }
  }
  return coordinates;
};

const getNumberRun = (grid: string[][], coordinate: Coordinate): number => {
  //Go to the row of the coordinate
  let target = grid[coordinate.y][coordinate.x];
  if (target === '.') return 0;
  let targetRow = grid[coordinate.y];
  let run = '';
  //Look left
  let left = targetRow.slice(0, coordinate.x);
  for (let i = left.length - 1; i >= 0; i--) {
    if (left[i] === '.' || isNaN(Number(left[i]))) break;
    run = left[i] + run;
  }

  //Look right
  let right = targetRow.slice(coordinate.x, targetRow.length);
  for (let i = 0; i < right.length; i++) {
    if (right[i] === '.' || isNaN(Number(right[i]))) break;
    run += right[i];
  }
  return Number(run);
};
