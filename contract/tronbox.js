const port = process.env.HOST_PORT || 9090

// const fetch = require('node-fetch');

// fetch('https://example.com/api/data')
//   .then(response => response.json())
//   .then(data => {
//     console.log(data);
//   })
//   .catch(error => {
//     console.error(error);
//   });

module.exports = {
  networks: {
    mainnet: {
      privateKey: "4a4e5ba28818433b33a074be2cf48cace33d40a6d9b32a09e94324e6a61bf242",
      /*
Create a .env file (it must be gitignored) containing something like

  export PRIVATE_KEY_MAINNET=4E7FEC...656243

Then, run the migration with:

  source .env && tronbox migrate --network mainnet

      */
      userFeePercentage: 100,
      feeLimit: 1000 * 1e6,
      fullHost: 'https://api.trongrid.io',
      network_id: '1'
    },
    shasta: {
      privateKey: "4a4e5ba28818433b33a074be2cf48cace33d40a6d9b32a09e94324e6a61bf242",
      userFeePercentage: 50,
      feeLimit: 1000 * 1e6,
      fullHost: 'https://api.shasta.trongrid.io',
      network_id: '2'
    },
    nile: {
      privateKey: "4a4e5ba28818433b33a074be2cf48cace33d40a6d9b32a09e94324e6a61bf242",
      userFeePercentage: 100,
      feeLimit: 1000 * 1e6,
      fullHost: 'https://api.nileex.io',
      network_id: '3'
    },
    development: {
      // For tronbox/tre docker image
      privateKey: '0000000000000000000000000000000000000000000000000000000000000001',
      userFeePercentage: 0,
      feeLimit: 1000 * 1e6,
      fullHost: 'http://127.0.0.1:' + port,
      network_id: '9'
    },
    compilers: {
      solc: {
        version: '0.8.0'
      }
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
