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
  let total = totalPoints(file);
  const end = performance.now();
  console.log(total);
  console.log(`Execution took ${end - start} ms`);
};

const totalPoints = (file: string[][][]) => {
  let cardMap = new Map<string, number>();

  for (let i = 0; i < file.length; i++) {
    let [winnerCard, card] = file[i];
    //We have the card, so we add it to the map
    if (!cardMap.has(winnerCard.toString())) {
      cardMap.set(winnerCard.toString(), 1);
    }
    //Get the amount of each card
    let cycles = cardMap.get(winnerCard.toString());
    //Cycle through according to the amount of cards
    for (let cycle = 0; cycle < cycles; cycle++) {

      //Determines if the card is a winner
      let matchedNumber = [];
      for (let j = 0; j < winnerCard.length; j++) {
        if (card.includes(winnerCard[j])) {
          matchedNumber.push(winnerCard[j]);
        }
      }
      //If the card is not a winner, we continue
      if (matchedNumber.length === 0) continue;

      //If the card is a winner, we determine the points won.

      //Get the neighbors of the card
      let neighbors = file.slice(i + 1, i + matchedNumber.length + 1);
      //Iterate through the neighbors
      for (let [neighbor, numbers] of neighbors) {
        //Make neighbor if it doesn't exist
        if (!cardMap.has(neighbor.toString())) {
          cardMap.set(neighbor.toString(), 1);
        }
        cardMap.set(neighbor.toString(), cardMap.get(neighbor.toString()) + 1);


      }
    }
  }
  console.log(cardMap);
  //Sum up the points in the map
    let total = 0;
    for (let [key, value] of cardMap) {
        total += value;
    }
    return total;
};

const determinePoints = (matchedNumber: string[]) => {
if (matchedNumber.length === 1) {
    return 1;
  }
  //Start multiplier based on number of matched cards after 1
  let cardPoints = 1;
  //iterate through matchedNumber
  for (let k = 0; k < matchedNumber.length - 1; k++) {
    cardPoints *= 2;
  }
  return cardPoints;

}
