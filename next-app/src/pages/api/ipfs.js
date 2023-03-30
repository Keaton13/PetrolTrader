const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

Moralis.start({
    apiKey: process.env.MORALIS,
    // ...and any other configuration
  });

export default function handler(req, res) {
  const ipfs = async () => {
    let metaData = req.body;
    console.log(metaData);

    const abi = [
      {
        path: "metadata.json",
        content: metaData,
      },
    ];

    const response = await Moralis.EvmApi.ipfs.uploadFolder({ abi });

    console.log(response.toJSON());

    res.status(200);
  };
  ipfs();
}
