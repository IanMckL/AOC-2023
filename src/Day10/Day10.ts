import * as fs from 'fs';

export const Main = () => {
  const file = fs.readFileSync('src/Day10/input.txt', 'utf8');
  let lines = file.split('\n');

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === 'S') {
        let distanceFromStart = 0;
        let currentCoordinate = {
          x: j,
          y: i,
        };
        let lastCoordinate = {
          x: null,
          y: null,
        };
          let atEndOfPipe = false;

        while (!atEndOfPipe) {
          let x = currentCoordinate.x;
          let y = currentCoordinate.y;
          let currentSymbol = lines[y][x];

          if (currentSymbol === 'S' && distanceFromStart > 0) {
            console.log('Loop complete');
            atEndOfPipe = true;
            continue;
          }

          //Go north?
          if (
            canGoDirection(
              x,
              y - 1,
              ['|', 'F', '7', 'S'],
              currentSymbol,
              lines,
            ) &&
            shouldGoDirection(lastCoordinate.x, lastCoordinate.y, x, y - 1)
              && symbolCanGoDirection(['|', 'J', 'L', 'S'], lines[y][x])
          ) {
            currentCoordinate.y = y - 1;
            lastCoordinate.x = x;
            lastCoordinate.y = y;
            distanceFromStart++;
            console.log('Going north');
            continue;
          }
          //Go south?
          if (
            canGoDirection(
              x,
              y + 1,
              ['|', 'L', 'J', 'S'],
              currentSymbol,
              lines,
            ) &&
            shouldGoDirection(lastCoordinate.x, lastCoordinate.y, x, y + 1)
              && symbolCanGoDirection(['|', 'F', '7', 'S'], lines[y][x])
          ) {
            currentCoordinate.y = y + 1;
            lastCoordinate.x = x;
            lastCoordinate.y = y;
            distanceFromStart++;
            console.log('Going south');
            continue;
          }
          //Go east?
          if (
            canGoDirection(
              x + 1,
              y,
              ['-', '7', 'J', 'S'],
              currentSymbol,
              lines,
            ) &&
            shouldGoDirection(lastCoordinate.x, lastCoordinate.y, x + 1, y)
              && symbolCanGoDirection(['-', 'L', 'F', 'S'], lines[y][x])
          ) {
            lastCoordinate.x = x;
            lastCoordinate.y = y;
              currentCoordinate.x = x + 1;

              distanceFromStart++;
            console.log('Going east');
            continue;
          }
          //Go west?
          if (
            canGoDirection(
              x - 1,
              y,
              ['-', 'F', 'L' ],
              currentSymbol,
              lines,
            ) &&
            shouldGoDirection(lastCoordinate.x, lastCoordinate.y, x - 1, y)
              && symbolCanGoDirection(['-', '7', 'J', 'S'], lines[y][x])
          ) {
            currentCoordinate.x = x - 1;
            lastCoordinate.x = x;
            lastCoordinate.y = y;
            distanceFromStart++;
            continue;
          }

           atEndOfPipe = true;

        }
         let roundedDown = Math.ceil(distanceFromStart / 2);
            console.log(roundedDown);
      }
    }
  }
};

const canGoDirection = (
  destinationx: number,
  destinationy: number,
  currentSymbols: string[],
  currentSymbol: string,
  lines: string[],
): boolean => {
  //check if destination is out of bounds
  if (
    destinationx < 0 ||
    destinationx > lines[0].length ||
    destinationy < 0 ||
    destinationy > lines.length
  ) {
      console.log("Out of bounds");
    return false;
  }
  //check if destination is allowed according to current symbol
  if (currentSymbols.includes(lines[destinationy][destinationx])) {
      console.log("Allowed");
    return true;
  }
};

const shouldGoDirection = (
  lastX: number,
  lastY: number,
  destinationX: number,
  destinationY: number,
): boolean => {
  //if last coordinate is same as the destination, we should not go there.
  if (lastX === destinationX && lastY === destinationY) {
      console.log("I was here before");
    return false;
  }
  return true;
};


const symbolCanGoDirection = (acceptableSymbols: string[], currentSymbol: string) => {
    return acceptableSymbols.includes(currentSymbol);
}
