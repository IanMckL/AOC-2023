import * as fs from 'fs';

export const Main = () => {
  const file = fs.readFileSync('src/Day2/input.txt', 'utf8');
  const lines = file.split('\n');

  let sumOfPossibleGameIDs = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line === '') {
      continue;
    }

    const gameName = line.split(':')[0];
    const gameNumber = Number(gameName.split(' ')[1]);

    const gameData = line.split(':')[1];

    const subGames = gameData.split(';');

    let largestRedDiceCount = 0;
    let largestGreenDiceCount = 0;
    let largestBlueDiceCount = 0;

    for (let j = 0; j < subGames.length; j++) {
      const subGame = subGames[j];

      const subGameDice = subGame.split(',');
      for (let k = 0; k < subGameDice.length; k++) {
        const dice = subGameDice[k].trim();
        const diceColor = dice.split(' ')[1];
        const diceCount = Number(dice.split(' ')[0]);

        if (diceColor === 'red' && diceCount > largestRedDiceCount) {
          largestRedDiceCount = diceCount;
        }
        if (diceColor === 'green' && diceCount > largestGreenDiceCount) {
          largestGreenDiceCount = diceCount;
        }
        if (diceColor === 'blue' && diceCount > largestBlueDiceCount) {
          largestBlueDiceCount = diceCount;
        }
      }
    }

    if (
      gameWasPossible(
        largestRedDiceCount,
        largestGreenDiceCount,
        largestBlueDiceCount,
      )
    ) {
      sumOfPossibleGameIDs += gameNumber;
    }
  }

  return sumOfPossibleGameIDs;
};

const gameWasPossible = (
  redDice: number,
  greenDice: number,
  blueDice: number,
) => {
  if (redDice > 12) {
    return false;
  }
  if (greenDice > 13) {
    return false;
  }
  if (blueDice > 14) {
    return false;
  }
  return true;
};
