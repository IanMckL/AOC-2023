import {readFileSync} from "fs";
import {makeGrid} from "../Day3/Day3.js";

export const Main = () => {

    const file = readFileSync('src/Day16/input.txt', 'utf8').split('\n').filter((x) => x !== '');

    const grid = makeGrid(file);
    let visited = new Set<string>();
    moveThroughGrid(grid, 0, 0, 1, 0,  visited);
    let parsedSet = coordinatesSet(visited);
    console.log(parsedSet.size);

}

const coordinatesSet = (inputSet: Set<string>): Set<string> => {
    let coordinates = new Set<string>();
    inputSet.forEach((value) => {
        coordinates.add(value.split(',').slice(0, 2).join(','));
    })
    return coordinates;
}


const separateVisited = (visited: Set<string>) => {
    let parsedVisited = [];
    visited.forEach((value) => {
        parsedVisited.push(value.split(','));
    })
    return parsedVisited;
}


const moveThroughGrid = (grid: string[][], x: number, y: number, xDirection:number, yDirection: number,  visited: Set<string>) => {
    //Check if y exists
    if(!grid[y]) {
        return;
    }
    if(!grid[y][x]) {
        return;
    }

    //If we've visited this tile before, return
    if(visited.has(`${x},${y},${xDirection},${yDirection}`)) {
        return;
    }

    visited.add(`${x},${y},${xDirection},${yDirection}`);

    //If we are at a .  move further in the same direction
    if(grid[y][x] === '.') {
        //Check if next step is out of bounds
        if(x + xDirection > grid[0].length || x + xDirection < 0 || y + yDirection > grid.length || y + yDirection < 0) {
            return;
        }

        return moveThroughGrid(grid, x + xDirection, y + yDirection, xDirection, yDirection, visited);
    }
    //If we are at a /, move right or down depending on direction
    if(grid[y][x] === '/') {
        if(xDirection === 1) {
            //Move up
             moveThroughGrid(grid, x , y -1, 0, -1, visited);
             return;
        }
        if(xDirection === -1) {
            //Move down
             moveThroughGrid(grid, x, y + 1, 0, 1, visited);
             return;
        }
        if(yDirection === -1) {
            //Move right
             moveThroughGrid(grid, x + 1, y, 1, 0, visited);
             return;

        }
        if(yDirection === 1) {
            //Move left
            return moveThroughGrid(grid, x -1, y, -1, 0, visited);

        }
    }

    if(grid[y][x] === '\\') {
        //Check if next step is out of bounds
        if(xDirection === 1) {
            //Move down
            moveThroughGrid(grid, x , y + 1, 0, 1, visited);
            return;
        }
        if(xDirection === -1) {
            //Move up
             moveThroughGrid(grid, x, y -1, 0, -1, visited);
             return;
        }
        if(yDirection === -1) {
            //Move left
             moveThroughGrid(grid, x - 1, y , -1, 0, visited);
             return;

        }
        if(yDirection === 1) {
            //Move right
             moveThroughGrid(grid, x + 1, y, 1, 0, visited);
             return;
        }
    }

    if(grid[y][x] === "|"){

        //If coming from left or right, return up plus down
        if(xDirection === 1 || xDirection === -1) {
            moveThroughGrid(grid, x, y + 1, 0, 1, visited)
            moveThroughGrid(grid, x, y -1, 0, -1, visited)
            return;
        }
       //If coming from up direction, return down
        if(yDirection === -1) {
             moveThroughGrid(grid, x , y - 1, 0, -1, visited);
             return;
        }
        //If coming from down direction, return up
        if(yDirection === 1) {
             moveThroughGrid(grid, x , y + 1, 0, 1, visited);
             return;
        }
    }

    if(grid[y][x] === "-"){
        //Check if next step is out of bounds


        //If coming from up or down, return left plus right
        if(yDirection === 1 || yDirection === -1) {
             moveThroughGrid(grid, x + 1, y, 1, 0, visited)
             moveThroughGrid(grid, x -1, y, -1, 0, visited);
             return
        }
         //If coming from left direction, return left hand side
        if(xDirection === -1) {
             moveThroughGrid(grid, x -1, y, -1, 0, visited);
             return;
        }
        //If coming from right direction, return right hand side
        if(xDirection === 1) {
             moveThroughGrid(grid, x + 1, y, 1, 0, visited);
             return ;
        }
    }
}

