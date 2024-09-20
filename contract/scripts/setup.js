var fs = require('fs')
var path = require('path')
import fetch from 'node-fetch';

fetch('https://example.com/api/data')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });

const tronboxJs = require('../tronbox').networks
const metacoinConfig = {
  // contractAddress: address,
  data: tronboxJs,
  // fullHost: tronboxJs.fullHost
}

fs.writeFileSync(path.resolve(__dirname, '../src/js/metacoin-config.js'),`var metacoinConfig = ${JSON.stringify(metacoinConfig, null, 2)}`)
