import { readFileSync } from 'fs';

export const Main = () => {
  //Load input
  const file = readFileSync('src/Day12/input.txt', 'utf8');

  let lines = file.split('\n').filter((line) => line !== '');
  let parsedLines = sumArray(parseLines(lines));
};

const parseLines = (lines: string[]): number[] => {
  let totalArray: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    let [game, rules] = lines[i].split(' ');
    let ruleNumbers: number[] = rules
      .split(',')
      .map((rule) => parseInt(rule, 10));
    let total = recursiveCount(game, ruleNumbers);
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

export const memoize = <Args extends unknown[], Result>(
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

//We memoize the recursiveCount function because it is called many times with the same arguments. This is a good way of
// speeding up the process and reducing the amount of time it takes to run the program.
const recursiveCount = memoize(
  (line: string, remainingRounds: number[]): number => {
    //Some rounds end with a '#', meaning that we haven't counted it as a solution like we do in our code below.
    //If the line is empty and the remaining array is empty, it's a valid combination e.g. if the line is  "" and
    //the remaining array is [], it's considered as solved and a valid combination
    if (line.length === 0) {
      if (remainingRounds.length === 0) {
        //This is one of only two places where we return 1, meaning that we have a valid solution
        return 1;
      }
      //Something has gone wrong if the line's length is 0, and we still have numbers remaining in remainingRounds,
      //so we return 0

      return 0;
    }
    //If remainingRounds.length = 0, it means that when ...rest was passed in, nothing was left. we've reached the
    // end of our job, but there still may be '#'s littered beyond, meaning that
    //our solution is invalid. If there are not, we count it sa a solution
    if (remainingRounds.length === 0) {
      //Loop through everything left in the line
      for (let i = 0; i < line.length; i++) {
        //If there is a single '#' beyond our solution, it's invalid
        if (line[i] === '#') {
          //Not a valid solution
          return 0;
        }
      }
      //If there isn't a '#' in the remaining line, we have a valid solution

      return 1;
    }

    //Test if the line can accommodate the remaining total of all rounds remaining. If not, return 0. remainingRounds.length - 1
    // is the number of '.'s that are required to separate the remainingRounds. If the line is shorter than that, it's
    // not amenable to a solution
    if (line.length < sumArray(remainingRounds) + remainingRounds.length - 1) {
      return 0;
    }
    //If the first spring in a line is '.', we need to start looking deeper into the line to find a solution
    if (line[0] === '.') {
      //Return the recursiveCount of the line, minus the first spring, and the remainingRounds.
      // Good luck, little soldier!
      return recursiveCount(line.slice(1), remainingRounds);
    }

    //Handle the case where the first spring is a '#'. This means that we
    if (line[0] === '#') {
      //Destructure the remainingRounds array into the first element and the rest of the array
      let [first, ...rest] = remainingRounds;
      //Loop through the line for the length of first, which is our current round. and if we find a '.', we return 0
      for (let i = 0; i < first; i++) {
        if (line[i] === '.') {
          return 0;
        }
      }
      //Check if the next spring after our potential solution is a '#'. If it is, it does not count as a solution, so we return 0
      if (line[first] === '#') {
        return 0;
      }

      //Alright. Now we know that the first spring is a '#', and that the next section of springs in our line does not
      //contain a '.'. We're clear to move on to the next round. We need to check if there is a solution in the rest of

      //We slice at first + 1 because that's the length of our most current round plus one, meaning we have the rest
      //of the line beyond the current round. We also pass in the rest of the remainingRounds array
      console.log(
        'Line is : ' +
          line +
          ' and remainingRounds is : ' +
          remainingRounds +
          '. Returning recursiveCount of ' +
          line.slice(first + 1) +
          ' and ' +
          rest,
      );

      //Line may be empty. Rest may also be empty. This would be a valid solution, so in that case it would return 1
      return recursiveCount(line.slice(first + 1), rest);
    }

    //At this point, we have all handled for '.' and '#', so we can now assume that the only remaining case is '?',
    //which is the possibility of the spring being either '.' or '#'. We need to check the amount of
    // combinations remaining for both cases and add them together. This is what we will return.

    //We slice the line at 1 because we're accounting for the first character we just added in place of the '?' and '#'
    //We also pass in the remainingRounds array because we're still looking for a solution

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

//Takeaways:
//-Memoization with maps is useful
//-Recursion can be used for pattern searching
