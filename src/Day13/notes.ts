///////////////////////////////////////////////////////////
// Other helper functions that would have been useful.
///////////////////////////////////////////////////////////
const transpose2DArray = (array: string[][]): string[][] => {
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

const stringDifferenceCount = (a: string, b: string): number => {
  let count = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) count++;
  }
  return count;
};

const getReflection = (array: string[][]) => {

};
