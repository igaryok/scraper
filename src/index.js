'use strict';

const { getWatchesLinks, getWatcheInfo } = require('./handleScrape');
const { saveToCSV } = require('./handleSave');

getWatchesLinks()
  .then(links => getWatcheInfo(links))
  .then(data => saveToCSV(data))
  .catch(err => console.error(err));
