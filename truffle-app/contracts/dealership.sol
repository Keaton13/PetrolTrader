// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address owner);

    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}

contract Dealership {
    address public nftAddress;
    address public inspector;
    address public lender;

    modifier onlyBuyer(uint256 _nftID) {
        require(msg.sender == buyer[_nftID], "Only buyer can call this method");
        _;
    }
    modifier iOwn(uint256 tokenId) {
        require(IERC721(nftAddress).ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT.");
        _;
    }
    modifier onlyInspector() {
        require(msg.sender == inspector, "Only inspector can call this method");
        _;
    }
    modifier onlyLender() {
        require(msg.sender == lender, "Only lender can call this function");
        _;
    }
    modifier hasFunds(uint256 _price, uint256 _balance) {
        require(_price == _balance, "Must have funds to call this function");
        _;
    }

}