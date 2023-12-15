import { readFile, readFileSync } from 'fs';


export const Main = () => {
  //Load file
  const file = readFileSync('src/Day15/input.txt', 'utf8')
    .split('\n')
    .filter((x) => x !== '')
    .map((x) => x.split(','))
    .flat();
  let total: number = 0;
  //Create map of boxes
  const boxes = new Map<number, string[]>();
  //Iterate through each entry in the data
  for (let i = 0; i < file.length; i++) {
    let stringTotal = hashCalculator(file[i]);
    //Place lens in box based on hash
    total += stringTotal;
    let symbol = file[i].includes('=') ? '=' : '-';
    let symbolIndex = file[i].indexOf(symbol);
    let lensFocal = file[i].slice(symbolIndex + 1, file[i].length);
    let lensIdString = file[i].slice(0, symbolIndex);
    let boxNumber = hashCalculator(lensIdString);
    //Handle case for symbol being =
    if (symbol === '=') {
      //Initialize lens string
      let lensString = `${lensIdString} ${lensFocal}`;
      //Check if box already has a lens matching the focal length
      if (boxes.has(boxNumber)) {
        //If it does, add the lens to the list of lenses
        let lenses = boxes.get(boxNumber);
        let matchFound = false;
        //Iterate through each lens in the box
        for (let j = 0; j < lenses.length; j++) {
          //Get the lens idString by searching for the first space
          let boxLensID = lenses[j].slice(0, lenses[j].indexOf(' '));
          //If the lens ID matches the box lens ID, replace the lens
          if (boxLensID === lensIdString) {
            matchFound = true;
            lenses[j] = lensString;
            break;
          }
        }
        if (!matchFound) {
          lenses.push(lensString);
        }
      }
      //If it doesn't, make a new box with the lens
      else {
        boxes.set(boxNumber, [lensString]);
      }
    }
    //Handle case for symbol being -
    if (symbol === '-') {
      //Check if the box already has a lens matching the focal length
      if (boxes.has(boxNumber)) {
        //If it does, remove the lens from the list of lenses, shifting the rest of the lenses down
        let lenses = boxes.get(boxNumber);
        //Iterate through each lens in the box
        for (let j = 0; j < lenses.length; j++) {
          //Get the lens idString by searching for the first space
          let boxLensID = lenses[j].slice(0, lenses[j].indexOf(' '));
          //If the lens ID matches the box lens ID, remove the lens
          if (boxLensID === lensIdString) {
            lenses.splice(j, 1);
            break;
          }
        }
      }
    }
  }

  let totalFocusingPower = 0;

  //Map through each box
  boxes.forEach((lenses, boxNumber) => {
    //Iterate through each lens in the box
    for (let i = 0; i < lenses.length; i++) {
      let lensPower =
        (boxNumber + 1) *
        (i + 1) *
        (lenses[i].split(' ')[1] as unknown as number);
      totalFocusingPower += lensPower;
    }
  });

  console.log(totalFocusingPower);
};

const hashCalculator = (inputString: string): number => {
  let total: number = 0;
  for (let i = 0; i < inputString.length; i++) {
    let charCode = inputString.charCodeAt(i);
    total += charCode;
    total = total * 17;
    total = total % 256;
  }
  return total;
};
