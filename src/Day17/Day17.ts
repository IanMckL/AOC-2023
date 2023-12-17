import { makeGrid } from '../Day3/Day3.js';
import { readFileSync } from 'fs';

interface Coordinate {
  x: number;
  y: number;
}

export const Main = () => {
  const file = readFileSync('src/Day17/input.txt', 'utf8')
    .split('\n')
    .filter((x) => x !== '');
  const grid = makeGrid(file);
  dijkstraPathFind(grid);
};


//Unoriginal Dijkstra's algorithm adapted from joeleisner's implementation. He's the smart one, not me. This is just
//a copy pasta from his implementation, with some comments added by me to make it easier to understand.
const dijkstraPathFind = (grid: string[][]) => {
  const visited: Set<string> = new Set<string>();
  const queue: number[][] = [[0, 0, 0, 0, 0, 0]];

  while (queue.length) {
    const [heatLoss, row, col, deltaX, deltaY, steps] = queue
      //Sort by heat loss, so we always pick the tile with the least heat loss. This is out 'distance' metric.
      .sort(([a], [b]) => b - a)
      .pop()!;
    //If we're at the bottom right, return
    if (row === grid.length - 1 && col === grid[0].length - 1) {
      console.log(heatLoss);
      return heatLoss;
    }
    //If we've visited this tile before, return
    const key = JSON.stringify([row, col, deltaX, deltaY, steps]);
    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    //If steps is below 3, we can move further in the same direction, however we can't move in the same direction if
    // deltaX and deltaY are both 0, because that means we're at the start.
    if (
      steps < 3 &&
      ![deltaX, deltaY].every((coordinate) => coordinate === 0)
    ) {
      const nextRow = row + deltaY;
      const nextCol = col + deltaX;
      //If not out of bounds, add to the queue, because we can move further in the same direction
      if (
        0 <= nextRow &&
        nextRow < grid.length &&
        0 <= nextCol &&
        nextCol < grid[0].length
      ) {
        queue.push([
          heatLoss + parseInt(grid[nextRow][nextCol]),
          nextRow,
          nextCol,
          deltaX,
          deltaY,
          steps + 1,
        ]);
      }
    }
    //
    for (const [nextRowDir, nextColDir] of [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]) {
      //Make sure we're not adding the same direction we came from OR the opposite direction we came from. Essentially,
      // relative to the direction we came from, we only add left or right, not forward or backwards.
      if (
        JSON.stringify([nextColDir, nextRowDir]) !==
          JSON.stringify([deltaX, deltaY]) &&
        JSON.stringify([nextColDir, nextRowDir]) !==
          JSON.stringify([-deltaX, -deltaY])
      ) {
        let nextRow = row + nextRowDir;
        let nextCol = col + nextColDir;
        //If not out of bounds, add to the queue, because we can move further in the same direction
        if (
          0 <= nextRow &&
          nextRow < grid.length &&
          0 <= nextCol &&
          nextCol < grid[0].length
        ) {
          queue.push([
            heatLoss + parseInt(grid[nextRow][nextCol]),
            nextRow,
            nextCol,
            nextColDir,
            nextRowDir,
            1,
          ]);
        }
      }
    }
  }
};
