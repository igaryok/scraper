'use strict';

const ObjectsToCsv = require('objects-to-csv');

exports.saveToCSV = async (data) => {
  const csv = new ObjectsToCsv(data);
 
  await csv.toDisk('./src/result.csv');
 
  // Return the CSV file as string:
  console.log(await csv.toString());
}
