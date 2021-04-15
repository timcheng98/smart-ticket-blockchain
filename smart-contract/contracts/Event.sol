pragma solidity ^0.5.16;
import {Counters} from "./ERC721Full.sol";



contract Event {
  using Counters for Counters.Counter;
  mapping(uint => Event) public events;
  mapping(address => bool) public approves;
  // mapping(string => bool) _ticketExists;
  uint256 public eventId = 0;
  uint256 public approveId = 0;
  address public eventContractOwner;
  mapping(uint => address) public eventOwner;

  mapping (address => Counters.Counter) private _ownedEventsCount;

  constructor() public {
    eventContractOwner = msg.sender;
  }

  struct Event {
    address owner;
    uint256 event_id;
    string hash_key;
  }

  event Create(address _owner, uint _event_id, string _hash_key);

  modifier onlyOwner() {
    require(eventContractOwner == msg.sender, 'sender is not a owner');
    _;
  }

  modifier onlyApprove() {
    require(approves[msg.sender] || eventContractOwner == msg.sender, 'sender is not approved');
    _;
  }

  function getEventContractOwner() public view returns(address) {
    return eventContractOwner;
  }

  function _incrementEvent() internal {
    eventId += 1;
  }

  function _incrementApprove() internal {
    approveId += 1;
  }

  function addApproval(address _approve) public onlyOwner {
    approves[_approve] = true;
    _incrementApprove();
  }

  function isApproval(address _approve) public view returns(bool) {
    return approves[_approve];
  }

  function removeApproval(address _approve) public onlyOwner {
    approves[_approve] = false;
  }

  function getEventOwner(uint _eventId) public view returns(address) {
    return eventOwner[_eventId];
  }

  function getEventId() public view returns (uint256) {
    return eventId;
  }

  function getEvent(uint _eventId) public view returns (uint256) {
    return events[_eventId].event_id;
  }

  function getApproveId() public view returns (uint256) {
    return approveId;
  }

  function createEvent(address _owner, uint256 _event_id, string memory _hash_key) public  {
    events[eventId] = Event(_owner, _event_id, _hash_key);
    eventOwner[eventId] = _owner;
    _ownedEventsCount[_owner].increment();
    _incrementEvent();
    emit Create(_owner, _event_id, _hash_key);
  }

  function eventOwnerBalanceOf(address _owner) public view returns (uint256) {
  require(eventContractOwner != address(0), "Event: balance query for the zero address");
      return _ownedEventsCount[_owner].current();
  }


}