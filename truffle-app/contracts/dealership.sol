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

    mapping (uint256 => bool) public isListed;
    mapping (uint256 => uint) public purchaseAmount;
    mapping (uint256 => uint) public loanAmount;
    mapping (uint256 => uint) public downPayment;
    mapping (uint256 => bool) public isLoan;
    mapping (uint256 => address) public buyer;
    mapping (uint256 => address) public seller;
    mapping (uint256 => bool) public inspectionPassed;
    mapping(uint256 => mapping(address => bool)) public approval;

    constructor(
        address _nftAddress,
        address _inspector,
        address _lender
        ) {
        nftAddress = _nftAddress;
        inspector = _inspector;
        lender = _lender;
    }


    function listCar(uint256 _nftID, uint256 _listPrice) public payable iOwn(_nftID) {
        seller[_nftID] = msg.sender;
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);
        // downPayment[_nftID] = (_listPrice * 20) / 100;
        // loanAmount[_nftID] = _listPrice * 80 / 100;
        isListed[_nftID] = true;
        purchaseAmount[_nftID] = _listPrice;
    }   

    function buyCar(bool _isLoan, uint256 _nftID) public payable {
        if(_isLoan == true) {
            finalizeLoan(_nftID);
        }
        buyer[_nftID] = msg.sender;
    }

    function finalizeLoan(uint256 _nftID) public {
        downPayment[_nftID] = (purchaseAmount[_nftID] * 20) / 100;
        loanAmount[_nftID] = purchaseAmount[_nftID] * 80 / 100;
        depositDownPayment(_nftID);
    }
        function depositDownPayment(uint256 _nftID) public payable onlyBuyer(_nftID) {
        require(msg.value >= downPayment[_nftID], "Insufficient down payment");
        (bool success,) = payable(seller[_nftID]).call{value: msg.value}("");
        require(success, "Failed to transfer down payment to seller");
    }

    function updatedInspectionStatus(uint256 _nftID, bool _passed) public onlyInspector {
        inspectionPassed[_nftID] = _passed;
    }

    function approveSale(uint256 _nftID) public {
        approval[_nftID][msg.sender] = true;
    }

    function finalizeSale(uint256 _nftID) public {
        require(inspectionPassed[_nftID], "Car has not passed inspection");
        require(approval[_nftID][buyer[_nftID]], "Buyer has not approved the sale");
        require(approval[_nftID][lender], "Lender has not approved the sale");
        if(isLoan[_nftID] == true){
            require(address(this).balance >= loanAmount[_nftID], "Insufficient funds to cover the purchase amount");
            isListed[_nftID] = false;
            (bool success,) = payable(lender).call{value: loanAmount[_nftID]}("");
            require(success, "Failed to transfer funds to seller");
            IERC721(nftAddress).transferFrom(address(this), buyer[_nftID], _nftID);

        } else {
            require(address(this).balance >= purchaseAmount[_nftID], "Insufficient funds to cover the purchase amount");
            isListed[_nftID] = false;
            (bool success,) = payable(seller[_nftID]).call{value: purchaseAmount[_nftID]}("");
            require(success, "Failed to transfer funds to seller");
            IERC721(nftAddress).transferFrom(address(this), buyer[_nftID], _nftID);

        }
    }

    receive() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}