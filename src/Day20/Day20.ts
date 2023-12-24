import { readFileSync } from 'fs';

interface Module {
  label: string;
  state: boolean;
  connections: string[];
  type: string;
  memory?: Map<string, MemoryItem>;
}
interface MemoryItem {
  label: string;
  state: boolean;
}

interface QueueItem {
  label: string;
  pulse: boolean;
  sender: string;
}

interface Accumulator {
  high: number;
  low: number;
}

export const Main = () => {
  const start = performance.now();
  const file = readFileSync('src/Day20/input.txt', 'utf8')
    .split('\n')
    .filter((x) => x !== '');
  let moduleMap = makeModuleMap(file);
  broadcast(moduleMap);
};

const eraseMemory = (moduleMap: Map<string, Module>) => {
  moduleMap.forEach((module) => {
    if (module.memory) {
      module.memory.forEach((memoryItem) => {
        memoryItem.state = false;
      });
    }
  });
}


const makeModuleMap = (file: string[]) => {
  let moduleMap = new Map<string, Module>();
  for (let i = 0; i < file.length; i++) {
    let [moduleRaw, connectionsRaw] = file[i].split('->').map((x) => x.trim());
    let type = moduleRaw[0];
    let label = moduleRaw.slice(1, moduleRaw.length);
    let connections = connectionsRaw.split(',').map((x) => x.trim());
    let module = {
      label: label,
      state: false,
      connections,
      type,
      memory: new Map<string, MemoryItem>(),
    };
    moduleMap.set(label, module);
  }

  //Now that we have all the modules, we need to add the connections to each memory & module
  moduleMap.forEach((module) => {
    module.connections.forEach((y) => {
      //If type is &, we need to add the connection to the memory of the module
      //Get the connection
      let connection = moduleMap.get(y);
      if (connection) {
        if (connection.type === '&') {
          //Add the connection to the memory of the module
          let memoryItem = {
            label: module.label,
            state: false,
          };
          connection.memory?.set(module.label, memoryItem);
        }
      }
    });
  });
  return moduleMap;
};

const broadcast = (moduleMap: Map<string, Module>) => {
  let totalHigh = 0;
  let totalLow = 0;

  for (let i = 0; i < 1000; i++) {
    let broadcaster = moduleMap.get('roadcaster');
    //We pressed the button, so that counts as a low pulse
    totalLow++;
    let queue: QueueItem[] = [];

    //Add all connections to the queue
    for (let x of broadcaster.connections) {
      //Make queue item
      let queueItem = {
        label: x,
        pulse: false,
        sender: broadcaster.label,
      };
      totalLow++;
      //Add to queue
      queue.push(queueItem);
    }

    while (queue.length > 0) {
      let item = queue.pop();
      let module = moduleMap.get(item.label);

      if (module.type === '&') {

        //Get the sender's id
        let sender = moduleMap.get(item.sender);
        if(sender){
          //Update memory item of module for sender
          let memoryItem = {
            label: sender.label,
            state: item.pulse,
          };
          module.memory?.set(sender.label, memoryItem);
        }




        let memory = module.memory;
        console.log(memory);
        //if all modules in memory are true, continue
        let allTrue = true;
        memory.forEach((x) => {

          if (!x.state) allTrue = false;
        });

        //If all are true, send out a pulse to all connections
        if (allTrue) {
          console.log("all memory is true, sending out pulse");
          console.log(module.memory);
          module.connections.forEach((x) => {
            let connection = moduleMap.get(x);
            if (connection) {
              totalLow++;
              queue.push({
                label: connection.label,
                pulse: false,
                sender: module.label,
              });
            } else {
              totalLow++;
            }
          });
        } else {
          module.connections.forEach((x) => {
            let connection = moduleMap.get(x);
            if (connection) {
              totalHigh++;
              queue.push({
                label: connection.label,
                pulse: true,
                sender: module.label,
              });
            } else {
              totalHigh++;
            }
          });
        }
      } else if (module.type === '%') {
        //if module has received a high pulse, continue
        if (item.pulse) continue;

        //if module has not received a high pulse, set state to opposite of its current state
        module.state = !module.state;

        //Loop through connections and add them to the front of  queue
        module.connections.forEach((x) => {
          let connection = moduleMap.get(x);
          //Set connection to receive pulse equal to the state of the module
          if (connection) {
            module.state ? totalHigh++ : totalLow++;

            //Set the connection's memory to the state of the module
            let memoryItem = {
              label: module.label,
              state: module.state,

            };
            connection.memory?.set(module.label, memoryItem);
            queue.push({
              label: connection.label,
              pulse: module.state,
              sender: module.label,
            });
          }
        });
      }
    }
  }

  console.log(totalHigh);
  console.log(totalLow);
  //multiply the total high and total low
  console.log(totalHigh * totalLow);
};
