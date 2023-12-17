import { readFileSync } from 'fs';

export const Main = () => {
  const start = performance.now();
  const file = readFileSync('src/Day4/input.txt', 'utf8')
    .split('\n')
    .filter((x) => x !== '')
    .map((x) =>
      x
        .split(':')[1]
        .split('|')
        .map((y) => y.split(' ').filter((z) => z !== ``)),
    );
 let points = totalPoints(file);
  console.log(points);
    const end = performance.now();
    console.log(`Execution took ${end - start} ms`);
};

const totalPoints = (file: string[][][]): number => {
  let total = 0;

  for (let i = 0; i < file.length; i++) {
    let [winnerCard, card] = file[i];
    let matchedNumber = [];
    for (let j = 0; j < winnerCard.length; j++) {
      if (card.includes(winnerCard[j])) {
        matchedNumber.push(winnerCard[j]);
      }
    }
    if (matchedNumber.length === 0) continue;

    if (matchedNumber.length === 1){
        total += 1;
        continue;
    }
    //Start multiplier based on number of matched cards after 1
    let cardPoints = 1;
    //iterate through matchedNumber
    for (let k = 0; k < matchedNumber.length -1 ; k++) {
        cardPoints *=2;
    }
    total += cardPoints;
  }
  return total;
};
