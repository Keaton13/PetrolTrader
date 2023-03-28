const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

export default function handler() {
  const ipfs = async () => {
    await Moralis.start({
      apiKey: process.env.MORALIS,
      // ...and any other configuration
    });

    const abi = [
      {
        path: "YOUR_FILE_PATH",
        content: "YOUR_JSON_OR_BASE64",
      },
    ];

    const response = await Moralis.EvmApi.ipfs.uploadFolder({ abi });

    console.log(response.toJSON());
  };
  ipfs();
}
