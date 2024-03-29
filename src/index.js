'use strict';

const { getWatchesLinks, getWatchesInfo } = require('./handleScrape');
const { saveToCSV } = require('./handleSave');

getWatchesLinks(10)
  .then(links => getWatchesInfo(links))
  .then(data => saveToCSV(data))
  .catch(err => console.error(err));
