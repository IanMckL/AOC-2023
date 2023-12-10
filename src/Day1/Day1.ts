import * as fs from 'fs';

enum Numbers {
  'one' = 1,
  'two' = 2,
  'three' = 3,
  'four' = 4,
  'five' = 5,
  'six' = 6,
  'seven' = 7,
  'eight' = 8,
  'nine' = 9,
  'zero' = 0,
}

export const Main = () => {
  const allLines: string = fs.readFileSync('src/Day1/input.txt', 'utf8');
  const lines: string[] = allLines.split('\n');
  let total: number = 0;
  for (let i = 0; i < lines.length; i++) {
    let numbersInLine: number[] = [];
    let line: string = lines[i];


    for (let j = 0; j < line.length; j++) {
      for(let [key, value] of Object.entries(Numbers)){
        if(line.slice(j, j + key.length) === key){
         if(!isNaN(Number(value.toString()))){
            numbersInLine.push(Number(value.toString()))
         }
        }
      }
      const char: string = line[j];
      if (!isNaN(Number(char))) {
        numbersInLine.push(Number(char));
      }
    }
    if (numbersInLine.length === 0) {
    } else if (numbersInLine.length === 1) {
      total += Number(`${numbersInLine[0]}${numbersInLine[0]}`);
    } else {
      total += Number(
        `${numbersInLine[0]}${numbersInLine[numbersInLine.length - 1]}`,
      );
    }
  }

  console.log('Total: ' + total);
};
