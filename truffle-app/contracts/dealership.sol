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
    event CarListed(uint256 indexed nftID, address indexed seller, uint256 listPrice);
    event CarBought(uint256 indexed nftID, address indexed buyer, uint256 indexed purchaseAmount);
    event CarSold(uint256 indexed nftID, address indexed buyer, address indexed seller, uint256 purchaseAmount);
    event CarInspected(uint indexed nftID, bool passed, address inspector);
    event SaleApproved(uint indexed nftID, address indexed approver);

    address public nftAddress;
    address public inspector;

    struct TokenData {
        uint256 nftID;
        address owner;
    }

    TokenData[] public listedTokens;
    TokenData[] public soldTokens;


    modifier onlyBuyer(uint256 _nftID) {
        require(msg.sender == buyer[_nftID], "Only buyer can call this method");
        _;
    }
    modifier onlyOwner(uint256 tokenId) {
        require(IERC721(nftAddress).ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT.");
        _;
    }
    modifier onlyInspector() {
        require(msg.sender == inspector, "Only inspector can call this method");
        _;
    }

    mapping (uint256 => bool) public isListed;
    mapping (uint256 => uint) public purchaseAmount;
    mapping (uint256 => address) public buyer;
    mapping (uint256 => address) public seller;
    mapping (uint256 => bool) public inspectionPassed;
    mapping(uint256 => mapping(address => bool)) public approval;

    constructor(
        address _nftAddress,
        address _inspector
        ) {
        nftAddress = _nftAddress;
        inspector = _inspector;
    }

    function listCar(uint256 _nftID, uint256 _listPrice) public payable onlyOwner(_nftID) {
        seller[_nftID] = msg.sender;
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);
        TokenData memory newToken = TokenData(_nftID, msg.sender);
        listedTokens.push(newToken);
        isListed[_nftID] = true;
        purchaseAmount[_nftID] = _listPrice;

        emit CarListed(_nftID, msg.sender, _listPrice);
    }   

    function buyCar(uint256 _nftID) public payable {
        require(msg.value >= purchaseAmount[_nftID], "Insufficient payment");
        buyer[_nftID] = msg.sender;

        emit CarBought(_nftID, msg.sender, purchaseAmount[_nftID]);
    }

    function updatedInspectionStatus(uint256 _nftID, bool _passed) public onlyInspector {
        inspectionPassed[_nftID] = _passed;

        emit CarInspected(_nftID, _passed, msg.sender);
    }

    function approveSale(uint256 _nftID) public {
        approval[_nftID][msg.sender] = true;

        emit SaleApproved(_nftID, msg.sender);
    }

    function getAllTokens() public view returns (uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](listedTokens.length);
        for (uint256 i = 0; i < listedTokens.length; i++) {
            tokenIds[i] = listedTokens[i].nftID;
        }
        return tokenIds;
    }

    function getAllSoldTokens() public view returns (uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](soldTokens.length);
        for (uint256 i = 0; i < soldTokens.length; i++) {
            tokenIds[i] = soldTokens[i].nftID;
        }
        return tokenIds;

    }
    function removeToken(uint256 tokenId) public {
        // find the index of the TokenData struct with the given token ID
        uint256 index = 0;
        bool found = false;
        for (uint256 i = 0; i < listedTokens.length; i++) {
        if (listedTokens[i].nftID == tokenId) {
            index = i;
            found = true;
            break;
        }
    }
    require(found, "Token ID not found in tokenList");
        // remove the TokenData struct from the tokenList array
        if (index < listedTokens.length - 1) {
            listedTokens[index] = listedTokens[listedTokens.length - 1];
        }
        listedTokens.pop();
    }   

    function finalizeSale(uint256 _nftID) public {
        require(address(this).balance >= purchaseAmount[_nftID], "Insufficient funds to cover the purchase amount");
        require(inspectionPassed[_nftID], "Car has not passed inspection");
        require(approval[_nftID][buyer[_nftID]], "Buyer has not approved the sale");
        require(approval[_nftID][seller[_nftID]], "Seller has not approved the sale");

        isListed[_nftID] = false;

        (bool success,) = payable(seller[_nftID]).call{value: purchaseAmount[_nftID]}("");
        require(success, "Failed to transfer funds to seller");
        removeToken(_nftID);
        IERC721(nftAddress).transferFrom(address(this), buyer[_nftID], _nftID);

        TokenData memory newToken = TokenData(_nftID, buyer[_nftID]);
        soldTokens.push(newToken);

        emit CarSold(_nftID, buyer[_nftID], seller[_nftID], purchaseAmount[_nftID]);
    }

    receive() external payable {}

    function getBalance() public view returns (uint256) {
        return (address(this).balance);
    }
}