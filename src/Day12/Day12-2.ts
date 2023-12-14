import { readFileSync } from 'fs';

export const Main = () => {
  //Load input
  const file = readFileSync('src/Day12/input.txt', 'utf8');

  let lines = file.split('\n').filter((line) => line !== '');
  let parsedLines = sumArray(parseLines(lines));

  console.log(parsedLines);
};

const parseLines = (lines: string[]): number[] => {
  let totalArray: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    let [game, rules] = lines[i].split(' ');
    let ruleNumbers: number[] = rules
      .split(',')
      .map((rule) => parseInt(rule, 10));
    let correctedGameString = [...game, ...game, ...game, ...game, ...game].join('?');
    let correctedRuleNumbers = [...ruleNumbers, ...ruleNumbers, ...ruleNumbers, ...ruleNumbers, ...ruleNumbers]
    let total = recursiveCount(correctedGameString, correctedRuleNumbers);
    totalArray.push(total);
  }
  return totalArray;
};

const sumArray = (numberArray: number[]): number => {
  let total: number = 0;
  for (let i = 0; i < numberArray.length; i++) {
    total += numberArray[i];
  }
  return total;
};

const memoize = <Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
): ((...args: Args) => Result) => {
  const cache = new Map<string, Result>();
  return (...args: Args): Result => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    } else {
      const result = fn(...args);
      cache.set(key, result);
      return result;
    }
  };
};

// THIS IS NOT ORIGINAL. I could not solve today's puzzle with my current level of knowledge, so I consulted solutions
// posted elsewhere. I have rewritten it to include comments in order to better understand the operations.
// It should not be seen as a representation of my abilities,for better or for worse. Some variables have been renamed
// for clarity
const recursiveCount = memoize(
  (line: string, remainingRounds: number[]): number => {
    if (line.length === 0) {
      if (remainingRounds.length === 0) {
        return 1;
      }
      return 0;
    }
    if (remainingRounds.length === 0) {
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '#') {
          return 0;
        }
      }
      return 1;
    }
    if (line.length < sumArray(remainingRounds) + remainingRounds.length - 1) {
      return 0;
    }
    if (line[0] === '.') {
      return recursiveCount(line.slice(1), remainingRounds);
    }

    if (line[0] === '#') {
      let [first, ...rest] = remainingRounds;
      for (let i = 0; i < first; i++) {
        if (line[i] === '.') {
          return 0;
        }
      }
      if (line[first] === '#') {
        return 0;
      }
      return recursiveCount(line.slice(first + 1), rest);
    }

    const possiblitiesWithDot = recursiveCount(
      '.' + line.slice(1),
      remainingRounds,
    );
    const possiblitiesWithHash = recursiveCount(
      '#' + line.slice(1),
      remainingRounds,
    );

    return possiblitiesWithDot + possiblitiesWithHash;
  },
);

