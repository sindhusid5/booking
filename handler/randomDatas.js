const faker = require('faker');
const fs = require('fs');

const generateDummyData = (numberOfUsers) => {
  const dummyData = [];

  for (let i = 0; i < numberOfUsers; i++) {
    const user = {
      //name: faker.name.findName(),
      age: faker.random.number({ min: 12, max: 99 }), // Adjust the age range as needed
      SIN: faker.random.number({ min: 100_000_000, max: 999_999_999 }), // Adjust the SIN range as needed
    };

    dummyData.push(user);
  }

  return dummyData;
};

const saveDummyDataToJsonFile = (data, filename) => {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
};

const numberToGenerate = 1000;
const outputFile = 'dummyData.json';

const dummyData = generateDummyData(numberToGenerate);
saveDummyDataToJsonFile(dummyData, outputFile);

console.log(`Dummy data has been generated and saved to ${outputFile}`);
