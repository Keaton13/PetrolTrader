// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MintCar is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Car Dealership", "DLER") {}

    /**
    * @dev Mint a new car NFT.
    * @param tokenURI The URI of the token metadata.
    * @param approvedContract The address of the approved contract for transfer.
    * @return The ID of the newly minted token.
    */

    function mint(string memory tokenURI, address approvedContract) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        approve(approvedContract, newItemId);

        return newItemId;
    }

    /**
    * @dev Get the total supply of car NFTs.
    * @return The total supply of car NFTs.
    */
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
}
