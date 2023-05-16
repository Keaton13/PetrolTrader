require('dotenv').config();

module.exports = {
  env: {
    INFURA_API_KEY: process.env.INFURA_API_KEY,
    MORALIS: process.env.MORALIS,
    UPLOADER: process.env.UPLOADER
  },
};