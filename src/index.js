'use strict';

const request = require('request-promise');
const cheerio = require('cheerio');
const ObjectsToCsv = require('objects-to-csv');

const BASE_URL = 'https://www.watchfinder.com';
const SEARCH_URL = '/find/search?q=Rolex%20Omega';


const optionsMainRequest = {
  uri: `${BASE_URL}${SEARCH_URL}`,
  transform:  body => cheerio.load(body),
};

const getWatchesLinks = async () =>  {
  return await request(optionsMainRequest)
    .then(data => {
      const elem = data('[id^="prods_"]').find('.prods_content a');
      const urls = [];

      elem.slice(0, 10).each((index, item) => urls[index] = item.attribs.href);
      
      return urls;
    })
    .catch(err => console.error(err));
}

const getWatcheInfo = async (links) => {

  const arrayData = links.map(async (link) => {
    const optionsWatchRequest = {
      uri: `${BASE_URL}${link}`,
      transform:  body => cheerio.load(body),
    };  
    
    const data = await request(optionsWatchRequest);
    
    const brand = data('h1 .prod_brand').text();
    const model = data('h1 .prod_series').text();
    const referenceNumber = data('h1 .ellipsis').text();
    const caseSize = data('.prod_info-table td').eq(10).next().text();

    const res = {
        brand,
        model,
        referenceNumber,
        caseSize
      };

    return res;
    })

    return Promise.all([...arrayData])
}

const saveToCSV = async (data) => {
  const csv = new ObjectsToCsv(data);
 
  // Save to file:
  await csv.toDisk('./src/result.csv');
 
  // Return the CSV file as string:
  console.log(await csv.toString());
}

getWatchesLinks()
  .then(links => getWatcheInfo(links))
  .then(data => saveToCSV(data))
  .catch(err => console.error(err));
