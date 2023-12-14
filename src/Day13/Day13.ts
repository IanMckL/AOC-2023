import { readFileSync } from 'fs';

export const Main = () => {
  //Load input
  const file = readFileSync('src/Day13/input.txt', 'utf8');

  const parsedLines = splitBlocksOnSpace(file);

  let totalRowsToLeft = 0;
  let totalRowsAbove = 0;

  for (let i = 0; i < parsedLines.length; i++) {
    let rowsToLeft = columnSearch(parsedLines[i]);
    let rowsAbove = rowSearch(parsedLines[i]);

    console.log('Rows to left: ' + rowsToLeft);
    console.log('Rows above: ' + rowsAbove);
    totalRowsToLeft += rowsToLeft;
    totalRowsAbove += rowsAbove;

  }

  console.log('Total rows to left: ' + totalRowsToLeft);
  console.log('Total rows above: ' + totalRowsAbove);
  let total = (totalRowsAbove * 100) + totalRowsToLeft;

  console.log('Total: ' + total);

};

const splitBlocksOnSpace = (input: string): string[][] => {
  //Split the lines into an array of strings, split on one blank line in between
  let lineRegex = /\n\s*\n/;
  let lines = input.split(lineRegex);
  let parsedLines: string[][] = [];
  for (let i = 0; i < lines.length; i++) {
    //Take off whitespace at the end of the line
    parsedLines.push(
      lines[i]
        .split('\n')
        .filter((line) => line !== '')
        .map((line) => line.trim()),
    );
  }
  return parsedLines;
};

const columnSearch = (input: string[]) => {

  //Initiate rowsAbove and rowsBelow
  let rowsToLeft = 0;
  //Iterate through every two columns. If the columns match, get the number of columns to the right

  //Iterate through two columns at a time
  for (let i = 0; i < input[0].length; i++) {
    let firstColumn = [];
    let secondColumn = [];
    for (let j = 0; j < input.length; j++) {
      firstColumn.push(input[j][i]);
      //If there's a column to the right, push it to the secondColumn array
      if (i + 1 < input[0].length) {
        secondColumn.push(input[j][i + 1]);
      }
    }

    //Test if the columns match
    let matchFound = firstColumn.join('') === secondColumn.join('');

    let trueMatchFound = false;

    //If the columns match, bubble out and see if the other columns match
    if (matchFound) {
      //Define max columns we need to bubble out to search and make sure there

      //Whichever is more, the number of columns to the left or the number of columns to the right, we bubble out that far
      let maxColumnsToBubbleOut = Math.min(i, input[0].length - i);
      let allColumnsMatch = true;
      for (let offSet = 1; offSet < maxColumnsToBubbleOut; offSet++) {
        //Define the columns we're going to compare
        let leftColumn = [];
        let rightColumn = [];
        for (let j = 0; j < input.length - 1; j++) {
          leftColumn.push(input[j][i - offSet]);
          //If there's a column to the right, push it to the secondColumn array
          if (i + offSet + 1 < input[0].length) {
            rightColumn.push(input[j][i + offSet + 1]);
          }
        }

        //If right column is empty, we're at the end of the line
        if (rightColumn.length === 0) {
          trueMatchFound = true;
          break;
        }

        //Test if the columns match
        let matchFound = leftColumn.join('') === rightColumn.join('');

        if (!matchFound) {
          allColumnsMatch = false;
        }
      }
      if (allColumnsMatch) {
        rowsToLeft = i + 1;
        break;
      }
    }
  }
  return rowsToLeft;
};

const rowSearch = (input: string[]) => {
  let rowsAbove = 0;

  for (let i = 0; i < input.length; i++) {
    let firstRow = input[i];
    let secondRow = input[i + 1];

    //Test if the rows match
    let matchFound = firstRow === secondRow;

    //If the rows match, bubble out and see if the other rows match
    if (matchFound) {
      //Define max rows we need to bubble out to search and make sure there

      //Whichever is more, the number of rows above or the number of rows below, we bubble out that far
      let maxRowsToBubbleOut = Math.min(i, input.length - i);
      let allRowsMatch = true;
      for (let offSet = 1; offSet <= maxRowsToBubbleOut; offSet++) {
        //Define the rows we're going to compare
        let aboveRow = input[i - offSet];
        let belowRow = input[i + offSet + 1];

        //If below row is empty, we're at the end of the line
        if (belowRow === undefined) {
          break;
        }
        //Test if the rows match
        let matchFound = aboveRow === belowRow;
        if (!matchFound) {
          allRowsMatch = false;
          break;
        }
      }
      //If all rows match, return the number of rows to the left
      if (allRowsMatch) {
        rowsAbove = i + 1;
        break;
      }
    }
  }
  return rowsAbove;
};
