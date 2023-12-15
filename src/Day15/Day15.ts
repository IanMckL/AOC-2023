import { readFile, readFileSync } from 'fs';

export const Main = () => {
  //Load file
  const file = readFileSync('src/Day15/input.txt', 'utf8')
    .split('\n')
    .filter((x) => x !== '')
    .map((x) => x.split(','))
    .flat();
    let total: number = 0;
  //Iterate through each entry in the data
    for (let i = 0; i < file.length; i++) {
       let stringTotal = hashCalculator(file[i])
        total += stringTotal;
    }
    console.log(total)


};

const hashCalculator = (inputString: string): number => {

    //Create total
    let total: number = 0;

    //Get ASCII code for each character
    for (let i = 0; i < inputString.length; i++) {
        let charCode = inputString.charCodeAt(i);
        total += charCode;
        total = total * 17;
        total = total % 256;
    }
    console.log(total)
    return total;

}
