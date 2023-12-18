import {readFileSync} from "fs";

export const Main = () => {
    const start = performance.now();
    let file = readFileSync('src/Day5/input.txt', 'utf8')
    let seeds = getValues(file, 'seeds:').flat();
    let seedToSoilMap = getValues(file, 'seed-to-soil map:');
    let soilToFertilizerMap = getValues(file, 'soil-to-fertilizer map:');
    let fertilizerToWaterMap = getValues(file, 'fertilizer-to-water map:');
    let waterToLightMap = getValues(file, 'water-to-light map:');
    let lightToTempMap = getValues(file, 'light-to-temperature map:');
    let tempToHumidityMap = getValues(file, 'temperature-to-humidity map:');
    let humidityToLocationMap = getValues(file, 'humidity-to-location map:');

    let locationValues = [];
    for(let i = 0; i < seeds.length; i++){
        let mappedTest= mapSourceToDestination( seedToSoilMap, parseInt(seeds[i]));
        let mappedFertilizer = mapSourceToDestination(soilToFertilizerMap, mappedTest);
        let mappedWater = mapSourceToDestination(fertilizerToWaterMap, mappedFertilizer);
        let mappedLight = mapSourceToDestination(waterToLightMap, mappedWater);
        let mappedTemp = mapSourceToDestination(lightToTempMap, mappedLight);
        let mappedHumidity = mapSourceToDestination(tempToHumidityMap, mappedTemp);
        let mappedLocation = mapSourceToDestination(humidityToLocationMap, mappedHumidity);
        locationValues.push(mappedLocation);
    }

    //Find the lowest location value
    let lowestLocation = Math.min(...locationValues);
    console.log("Lowest Location: " + lowestLocation);
    const end = performance.now();
    console.log(`Execution took ${end - start} ms`);

}

const mapSourceToDestination = (mappings: string[][], sourceValue: number) => {
    for (let i = 0; i < mappings.length; i++) {
        let [destStart, srcStart, length] = mappings[i].map(Number);
        if (sourceValue >= srcStart && sourceValue < srcStart + length) {
            return destStart + (sourceValue - srcStart);
        }
    }
    return sourceValue;
};
const getValues = (file: string, keyword: string) => {
   //Get portion of file that contains the keyword
    let keywordIndex = file.indexOf(keyword);
    let keywordString = file.slice(keywordIndex + keyword.length + 1);
    //Split at next completely empty line
    let newLineIndex = keywordString.indexOf('\n\n');
    let splitKeyword = keywordString.slice(0, newLineIndex);
    let filtered = splitKeyword.split('\n').filter(x => x !== '').map(x => x.split(' '))
    return filtered;
}
