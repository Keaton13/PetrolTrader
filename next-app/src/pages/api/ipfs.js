const Moralis = require("moralis").default;

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
        path: "test.json",
        content: metaData,
      },
    ];

    const response = await Moralis.EvmApi.ipfs.uploadFolder({ abi });

    res.status(200).json({response});
  };
  ipfs();
}