import { readFileSync } from 'fs';
import { rimraf } from 'rimraf';

interface Range {
  min: number;
  max: number;
}

interface Rule {
  label: string;
  range: Range;
  destination: string;
  acceptOnTrue: boolean;
  rejectOnTrue: boolean;
}

interface Workflow {
  x: number;
  m: number;
  a: number;
  s: number;
}

interface Part {
  name: string;
  destination: string;
  rules: Rule[];
  acceptOnAllTrue: boolean;
  rejectOnAllTrue: boolean;
}

export const Main = () => {
  let start = performance.now();
  const file = readFileSync('src/Day19/input.txt', 'utf8')
    .split('\n\n')
    .map((x) => x.split('\n').filter((x) => x !== ''));

  let [parts, workFlows] = file;
  let partsMap: Map<string, Part> = constructPartsMap(parts);
  let workflows = constructWorkFlows(workFlows);

  processPartsAndWorkflows(partsMap, workflows);
};

const traverseParts = (
  destination: string,
  parts: Map<string, Part>,
  workflows: Workflow,
) => {
  //Get part from partsMap
  let part = parts.get(destination);

  //Get rules from part
  let rules = part.rules;
  let [x, m, a, s] = [workflows.x, workflows.m, workflows.a, workflows.s];

  for (let i = 0; i < rules.length; i++) {
    if (rules[i].label === 'x') {
      let { min, max } = rules[i].range;
      if (x > min && x < max) {
        if (rules[i].acceptOnTrue) {
          return 1;
        }
        if (rules[i].rejectOnTrue) {
          return 0;
        }

        //If we get here, we need to traverse to the next part
        let nextPart = rules[i].destination;
        return traverseParts(nextPart, parts, workflows);
      }
    }

    if (rules[i].label === 'm') {
      let { min, max } = rules[i].range;
      if (m > min && m < max) {
        if (rules[i].acceptOnTrue) {
          return 1;
        }
        if (rules[i].rejectOnTrue) {
          return 0;
        }

        //If we get here, we need to traverse to the next part
        let nextPart = rules[i].destination;
        return traverseParts(nextPart, parts, workflows);
      }
    }

    if (rules[i].label === 'a') {
      let { min, max } = rules[i].range;
      if (a > min && a < max) {
        if (rules[i].acceptOnTrue) {
          return 1;
        }
        if (rules[i].rejectOnTrue) {
          return 0;
        }

        //If we get here, we need to traverse to the next part
        let nextPart = rules[i].destination;

        return traverseParts(nextPart, parts, workflows);
      }
    }

    if (rules[i].label === 's') {
      let { min, max } = rules[i].range;
      if (s > min && s < max) {
        if (rules[i].acceptOnTrue) {
          return 1;
        }
        if (rules[i].rejectOnTrue) {
          return 0;
        }

        //If we get here, we need to traverse to the next part
        let nextPart = rules[i].destination;
        return traverseParts(nextPart, parts, workflows);
      }
    }
  }

  //IF acceptOnAllTrue is true, return 1
  if (part.acceptOnAllTrue) {
    return 1;
  }
  //If rejectOnAllTrue is true, return 0
  if (part.rejectOnAllTrue) {
    return 0;
  }


  //If we get here, we need to traverse to the next part
  let nextPart = part.destination;

  return traverseParts(nextPart, parts, workflows);
};

const processPartsAndWorkflows = (
  parts: Map<string, Part>,
  workflows: Workflow[],
) => {
  let totalAccepted = 0;

  for (let i = 0; i < workflows.length; i++) {
    let accepted = traverseParts('in', parts, workflows[i]);
    if (accepted === 1) {
      //Add x m a s to totalAccepted
      totalAccepted +=
        workflows[i].x + workflows[i].m + workflows[i].a + workflows[i].s;
    }
  }

  console.log(`Total accepted: ${totalAccepted}`);
};

const makeRange = (symbol: string, number): Range => {
  if (symbol === '<') {
    return { min: 0, max: number };
  }
  if (symbol === '>') {
    return { min: number, max: Infinity };
  }
};

const parsePart = (parts: string) => {
  let [name, rawRules] = parts.split('{').map((x) => x.replace('}', ''));

  let separatedRules = rawRules.split(',').map((x) => x.trim());

  let destination = separatedRules[separatedRules.length - 1];

  let rulesWithoutDestination = separatedRules.slice(
    0,
    separatedRules.length - 1,
  );

  let rules: Rule[] = [];
  for (let j = 0; j < rulesWithoutDestination.length; j++) {
    let [ruleInfo, ruleDestination] = rulesWithoutDestination[j].split(':');
    //Less than or equals than is going to always be at the 1st index of ruleInfo
    let symbol = ruleInfo[1];
    let number = parseInt(ruleInfo.slice(2));
    let range = makeRange(symbol, number);

    let acceptOnTrue = ruleDestination === 'A';
    let rejectOnTrue = ruleDestination === 'R';
    let destination =
      ruleDestination === 'A' || ruleDestination === 'R' ? '' : ruleDestination;

    let rule: Rule = {
      label: ruleInfo[0],
      range: range,
      destination: destination,
      acceptOnTrue: acceptOnTrue,
      rejectOnTrue: rejectOnTrue,
    };

    rules.push(rule);
  }

  let acceptOnAllTrue = destination === 'A';
  let rejectOnAllTrue = destination === 'R';

  let part: Part = {
    name: name,
    destination: destination,
    rules: rules,
    acceptOnAllTrue: acceptOnAllTrue,
    rejectOnAllTrue: rejectOnAllTrue,
  };

  return part;
};

const parseWorkFlow = (workFlow: string): Workflow => {
  //Remove {} from workFlow
  let rawWorkFlow = workFlow.replace('{', '').replace('}', '');
  let separatedWorkFlow = rawWorkFlow.split(',').map((x) => x.trim());
  let [x, m, a, s] = separatedWorkFlow.map((x) => parseInt(x.split('=')[1]));
  let workflow: Workflow = {
    x: x,
    m: m,
    a: a,
    s: s,
  };
  return workflow;
};

const constructWorkFlows = (workFlows: string[]) => {
  let finalWorkflows: Workflow[] = [];

  for (let i = 0; i < workFlows.length; i++) {
    let workflow = parseWorkFlow(workFlows[i]);
    finalWorkflows.push(workflow);
  }

  return finalWorkflows;
};

const constructPartsMap = (parts: string[]) => {
  let partsMap = new Map<string, Part>();

  for (let i = 0; i < parts.length; i++) {
    let parsedPart = parsePart(parts[i]);
    partsMap.set(parsedPart.name, parsedPart);
  }

  return partsMap;
};
