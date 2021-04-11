pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract Kyc {
    mapping(uint256 => string) public users;
    mapping(uint256 => string) public companies;
    uint256 public userCount = 0;
    uint256 public companyCount = 0;
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    event Create(uint256 _id, string _hashValue);
    event Identity(uint256 _id);

    modifier onlyOwner() {
        require(owner == msg.sender, 'sender is not a owner');
        _;
    }

    function incrementUserCount() internal {
        userCount += 1;
    }

    function incrementCompanyCount() internal {
        companyCount += 1;
    }

    function renewUser(uint256 _id, string memory _hashValue) public onlyOwner {
        users[_id] = _hashValue;
        emit Identity(_id);
    }

    function renewCompany(uint256 _id, string memory _hashValue) public onlyOwner {
        companies[_id] = _hashValue;
        emit Identity(_id);
    }

    function burnUser(uint256 _id) public onlyOwner {
        users[_id] = "0";
        emit Identity(_id);
    }

    function burnCompany(uint256 _id) public onlyOwner {
        companies[_id] = "0";
        emit Identity(_id);
    }

    function getUser(uint256 _id) public onlyOwner view returns (string memory) {
        return users[_id];
    }

    function getCompany(uint256 _id) public onlyOwner view returns (string memory) {
        return companies[_id];
    }

    function verifyUser(uint _id, string memory _hashHex) public view returns (bool) {
       return keccak256(abi.encodePacked(users[_id])) == keccak256(abi.encodePacked(_hashHex));
    }

    function verifyCompany(uint _id, string memory _hashHex) public view returns (bool) {
       return keccak256(abi.encodePacked(companies[_id])) == keccak256(abi.encodePacked(_hashHex));
    }

    function totalUserCount() public onlyOwner view returns (uint256) {
        return userCount;
    }

    function totalCompanyCount() public onlyOwner view returns (uint256) {
        return companyCount;
    }

    function getTotalUser(uint256[] memory _ids) public onlyOwner view returns (string [] memory) {
        string [] memory _users = new string [] (_ids.length);
        for (uint256 i = 0; i < _ids.length; i++) {
            _users[i] = users[_ids[i]];
        }
        return _users;
    }

    function getTotalCompany(uint256[] memory _ids) public view returns (string[] memory) {
        string [] memory _companies = new string [] (_ids.length);
        for (uint256 i = 0; i < _ids.length; i++) {
            _companies[i] = companies[_ids[i]];
        }
        return _companies;
    }

    function validateUser(uint256 _id, string memory _hashValue) public onlyOwner {
        users[_id] = _hashValue;
        incrementUserCount();
        emit Create(_id, _hashValue);
    }

    function validateCompany(uint256 _id, string memory _hashValue) public onlyOwner {
        companies[_id] = _hashValue;
        incrementCompanyCount();
        emit Create(_id, _hashValue);
    }
}
