import * as fs from 'fs';

export const Main = () => {
    //Load input
    const file = fs.readFileSync('src/Day11/input.txt', 'utf8');
    let lines = file.split('\n');
    //Remove empty lines
    lines = lines.filter((line) => line !== '');

    //Double the rows that have no galaxies in them
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] === '') continue;

        //If the line has no galaxies in it
        if (!lines[i].includes('#')) {
            let line = lines[i];
            //If the line is empty, add a new line with the same length
            let newLine = '.'.repeat(line.length);
            //Check if the line is out of bounds
            lines.splice(i, 0, newLine);
            i++;
        }
    }

    //Double the columns that have no galaxies in them
    for (let j = 0; j < lines[0].length; j++) {
        //If line is empty, skip it
        let galaxyInColumn = false;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i][j] === '#') {
                galaxyInColumn = true;
                break;
            }
        }
        if (!galaxyInColumn) {
            for (let i = 0; i < lines.length; i++) {
                lines[i] = lines[i].slice(0, j) + '.' + lines[i].slice(j);
            }
            j++; // Increment to skip the newly added column
        }
    }

    console.log(lines);
    let galaxies = [];
    //Find the coordinates for each galaxy
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[i].length; j++) {
            if (lines[i][j] === '#') {
                galaxies.push([j, i]);
            }
        }
    }

    console.log(galaxies);
    //Initialize a total distance
    let totalDistance = 0;

    for (let i = 0; i < galaxies.length - 1; i++) {
        let galaxyToCompare = galaxies[i];
        for (let j = i + 1; j < galaxies.length; j++) {
            const distance = calculateManhattanDistance( galaxyToCompare[0], galaxyToCompare[1], galaxies[j][0], galaxies[j][1]);
            totalDistance += distance;
        }
    }

    console.log(totalDistance);
};

interface QueueItem {
    cell: number[];
    distance: number;
}

const breadthFirstSearch = (grid, start: number[], target: number[]) => {
    let queue: QueueItem[] = [];
    queue.push({ cell: start, distance: 0 });
    let visited: Set<string> = new Set([
        start[0].toString() + ',' + start[1].toString(),
    ]);
    while (queue.length > 0) {
        let { cell, distance } = queue.shift();
        // console.log("distance: " + distance + " cell: " + cell + " target: " + target);
        if (cell[0] === target[0] && cell[1] === target[1]) {
            return distance;
        }

        for (let neighbor of getNeighbors(grid, cell[0], cell[1])) {
            let neighborKey = neighbor[0].toString() + ',' + neighbor[1].toString();
            if (!visited.has(neighborKey)) {
                queue.push({ cell: neighbor, distance: distance + 1 });
                visited.add(neighborKey);
            }
        }
    }
    return 0;
};

const getNeighbors = (grid: string[][], cellx, celly): number[][] => {
    let neighbors: number[][] = [];
    let directions = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
    ];
    for (let [dx, dy] of directions) {
        let x = cellx + dx;
        let y = celly + dy;
        if (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length) {
            neighbors.push([x, y]);
        }
    }

    return neighbors;
};

const calculateManhattanDistance = (x1, y1, x2, y2) => {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}
