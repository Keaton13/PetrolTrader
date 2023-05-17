// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// Interface for the ERC721 standard
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
    event InspectorAdded(address indexed inspector);
    event InspectorRemoved(address indexed inspector);

    address public nftAddress;
    address public contractOwner;
    address[] private inspectors;
    
    // Struct to store token data
    struct TokenData {
        uint256 nftID;
        address owner;
    }

    TokenData[] public listedTokens;
    TokenData[] public soldTokens;

    // Modifier to restrict a function to be called only by the buyer of the specified token
    modifier onlyBuyer(uint256 _nftID) {
        require(msg.sender == buyer[_nftID], "Only buyer can call this method.");
        _;
    }

    // Modifier to restrict a function to be called only by the owner of the specified NFT token
    modifier onlyOwner(uint256 tokenId) {
        require(IERC721(nftAddress).ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT.");
        _;
    }

    // Modifier to restrict a function to be called only by the contract owner
    modifier onlyContractOwner() {
        require(msg.sender == contractOwner, "Only contract owner can call this function.");
        _;
    }

    // Modifier to restrict a function to be called only by inspectors
    modifier onlyInspector() {
        bool isInArray = false;
        for (uint i = 0; i < inspectors.length; i++) {
            if (msg.sender == inspectors[i]) {
                isInArray = true;
                break;
            }
        }
        require(isInArray, "Only inspectors can call this method");
        _;
    }

    // Mapping to store listing status, purchase amounts, buyers, sellers, inspection status, and approvals
    mapping (uint256 => bool) public isListed;
    mapping (uint256 => uint) public purchaseAmount;
    mapping (uint256 => address) public buyer;
    mapping (uint256 => address) public seller;
    mapping (uint256 => bool) public inspectionPassed;
    mapping(uint256 => mapping(address => bool)) public approval;


    /**
    * @dev Constructor
    * @param _nftAddress The address of the NFT contract.
    * Description: Initializes the dealership contract with the NFT contract address and sets the contract owner.
    */
    constructor(
        address _nftAddress
    ) {
        nftAddress = _nftAddress;
        contractOwner = msg.sender;
    }

    /**
    * @dev Function: List a car for sale
    * @param _nftID The ID of the car NFT.
    * @param _listPrice The price at which the car is listed for sale.
    * Description: Allows the owner of a car NFT to list it for sale by transferring the ownership to the dealership contract.
    * Emits: CarListed event.
    */
    function listCar(uint256 _nftID, uint256 _listPrice) public payable onlyOwner(_nftID) {
        seller[_nftID] = msg.sender;
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);
        TokenData memory newToken = TokenData(_nftID, msg.sender);
        listedTokens.push(newToken);
        isListed[_nftID] = true;
        purchaseAmount[_nftID] = _listPrice;

        emit CarListed(_nftID, msg.sender, _listPrice);
    }   

    /**
    * @dev Function: Buy a car
    * @param _nftID The ID of the car NFT.
    * Description: Allows a user to buy a car listed for sale by transferring the ownership of the car NFT and the payment to the seller.
    * Emits: CarBought event.
    */
    function buyCar(uint256 _nftID) public payable {
        require(msg.value >= purchaseAmount[_nftID], "Insufficient payment");
        buyer[_nftID] = msg.sender;

        emit CarBought(_nftID, msg.sender, purchaseAmount[_nftID]);
    }

    /**
    * @dev Function: Update the inspection status of a car
    * @param _nftID The ID of the car NFT.
    * @param _passed The inspection status (true or false).
    * Description: Allows an inspector to update the inspection status of a car.
    * Emits: CarInspected event.
    */
     function updatedInspectionStatus(uint256 _nftID, bool _passed) public onlyInspector {
        inspectionPassed[_nftID] = _passed;

        emit CarInspected(_nftID, _passed, msg.sender);
    }

    /**
    * @dev Function: Add an inspector
    * @param _inspector The address of the inspector to be added.
    * Description: Allows the contract owner to add an inspector to the dealership.
    * Emits: InspectorAdded event.
    */
    function addInspector(address _inspector) public onlyContractOwner{
        inspectors.push(_inspector);
        emit InspectorAdded(_inspector);
    }

    /**
    * @dev Function: Remove an inspector
    * @param _inspector The address of the inspector to be removed.
    * Description: Allows the contract owner to remove an inspector from the dealership.
    * Emits: InspectorRemoved event.
    */
     function removeInspector(address _inspector) public onlyContractOwner {
        for (uint256 i = 0; i < inspectors.length; i++) {
            if (inspectors[i] == _inspector) {
                inspectors[i] = inspectors[inspectors.length - 1];
                inspectors.pop();
                emit InspectorRemoved(_inspector);
                return;
            }
        }
        revert("Inspector not found");
    }

    /**
    * @dev Function: Approve the sale of a car
    * @param _nftID The ID of the car NFT.
    * Description: Allows a user to approve the sale of a car they are involved in as a buyer or seller.
    * Emits: SaleApproved event.
    */
     function approveSale(uint256 _nftID) public {
        approval[_nftID][msg.sender] = true;

        emit SaleApproved(_nftID, msg.sender);
    }

    /**
    * @dev Function: Get all listed tokens
    * @return An array of token IDs representing all the cars currently listed for sale.
    */
     function getAllTokens() public view returns (uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](listedTokens.length);
        for (uint256 i = 0; i < listedTokens.length; i++) {
            tokenIds[i] = listedTokens[i].nftID;
        }
        return tokenIds;
    }

    /**
    * @dev Function: Get all sold tokens
    * @return An array of token IDs representing all the cars that have been sold.
    */
     function getAllSoldTokens() public view returns (uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](soldTokens.length);
        for (uint256 i = 0; i < soldTokens.length; i++) {
            tokenIds[i] = soldTokens[i].nftID;
        }
        return tokenIds;

    }

    /**
    * @dev Function: Remove a token from the listing
    * @param tokenId The ID of the token to be removed.
    * Description: Removes a token from the listing by finding its index in the listedTokens array and removing it.
    */
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

    /**
    * @dev Function: Finalize the sale of a car
    * @param _nftID The ID of the car NFT.
    * Description: Finalizes the sale of a car by transferring the payment to the seller and transferring the ownership of the car NFT to the buyer.
    * Emits: CarSold event.
    */
     function finalizeSale(uint256 _nftID) public {
        require(address(this).balance >= purchaseAmount[_nftID], "Insufficient funds to cover the purchase amount");
        require(inspectionPassed[_nftID], "Car has not passed inspection");
        require(approval[_nftID][buyer[_nftID]], "Buyer has not approved the sale");
        require(approval[_nftID][seller[_nftID]], "Seller has not approved the sale");

        isListed[_nftID] = false;

        // Transfer the funds to the seller and transfer the NFT to the buyer
        (bool success,) = payable(seller[_nftID]).call{value: purchaseAmount[_nftID]}("");
        require(success, "Failed to transfer funds to seller");
        removeToken(_nftID);
        IERC721(nftAddress).transferFrom(address(this), buyer[_nftID], _nftID);

        TokenData memory newToken = TokenData(_nftID, buyer[_nftID]);
        soldTokens.push(newToken);

        emit CarSold(_nftID, buyer[_nftID], seller[_nftID], purchaseAmount[_nftID]);
    }

    /**
    * @dev Fallback function: Receive Ether
    */
     receive() external payable {}

    /**
    * @dev Function: Get the balance of the contract
    * @return The balance of the contract.
    */
     function getBalance() public view returns (uint256) {
        return (address(this).balance);
    }
}