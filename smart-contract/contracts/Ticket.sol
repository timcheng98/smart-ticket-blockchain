pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "./ERC721Full.sol";
import "./Event.sol";

contract Ticket is ERC721Full, Event {
    mapping(uint256 => Ticket) public tickets;
    // mapping(string => bool) _ticketExists;
    uint256 public ticketCount = 0;
    address public ticketContractOwner;

    // mapping(uint256 => address) public ticketApprovals;
    mapping(uint256 => address) public marketplaceTickets;
    uint256[] public marketplaceTicketList;
    uint256 public marketplaceTicketId;

    constructor() public ERC721Full("Ticket", "TCK") {
        ticketContractOwner = msg.sender;
    }

    event CreateTicketsByEvent(uint256[] _tickets, uint256 _eventId);
    event CreateTickets(uint256[] _tickets);
    event Transfer(address from, address to, uint256 tokenId);
    event TransferMulti(address from, address to, uint256[] tokenId);
    event Trade(address target, uint256 tokenId);

    struct Ticket {
        uint256 eventId;
        uint256 ticket_id;
        uint256 ticketId;
    }

    function incrementCount() internal {
        ticketCount += 1;
    }

    function getTicketCount() public view returns (uint256) {
        return ticketCount;
    }

    function getMarketplaceTicketId() public view returns (uint256) {
        return marketplaceTicketId;
    }

    function mint(uint256[] memory _tickets) public {
        for (uint256 index = 0; index < _tickets.length; index++) {
            _mint(msg.sender, ticketCount);
            tickets[ticketCount] = Ticket(
                eventId - 1,
                _tickets[index],
                ticketCount
            );
            incrementCount();
        }
        // require(!_ticketExists[_ticket]);
        emit CreateTickets(_tickets);
        // _ticketExists[_ticket] = true;
    }

    function mintByEvent(uint256[] memory _tickets, uint256 _eventId) public {
        for (uint256 index = 0; index < _tickets.length; index++) {
            _mint(msg.sender, ticketCount);
            tickets[ticketCount] = Ticket(
                _eventId,
                _tickets[index],
                ticketCount
            );
            incrementCount();
        }

        emit CreateTicketsByEvent(_tickets, _eventId);
    }

    function multiTransferFrom(
        address _from,
        address _to,
        uint256[] memory _tokenIds
    ) public {
        for (uint256 index = 0; index < _tokenIds.length; index++) {
            super.safeTransferFrom(_from, _to, _tokenIds[index]);
        }

        emit TransferMulti(_from, _to, _tokenIds);
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public {
        super.safeTransferFrom(_from, _to, _tokenId);

        emit Transfer(_from, _to, _tokenId);
    }
    function sellTicketsOnMarketplace(address seller, uint256 ticketId) public {
        address owner = super.ownerOf(ticketId);
        require(marketplaceTickets[ticketId] != seller, "Ticket already on the marketplace");
        require(seller == owner, "ERC721: seller is not the ticket owner");
        marketplaceTickets[ticketId] = seller;
        marketplaceTicketList.push(ticketId);
        marketplaceTicketId += 1;
        emit Trade(seller, ticketId);
    }

    function buyTicketOnMarketplace(address buyer, uint256 ticketId) public {
        address owner = ownerOf(ticketId);
        require(buyer != owner, "ERC721: buyer is not the ticket owner");
        require(_existMarketplaceTicket(ticketId), "Ticket is not sell on the mareketplace");
        transferFromByContractOwner(owner, buyer, ticketId);
        marketplaceTickets[ticketId] = address(0);
        emit Trade(buyer, ticketId);
    }

    function _existMarketplaceTicket(uint256 ticketId) internal view returns (bool) {
        address owner = marketplaceTickets[ticketId];
        return owner != address(0);
    }

    function transferFromByContractOwner(address from, address to, uint256 tokenId) public {
        require(msg.sender == from || msg.sender == ticketContractOwner, "ERC721: transfer caller is not owner nor approved");

        super._transferFrom(from, to, tokenId);
        emit Transfer(from, to, tokenId);
    }

    

    function getTicketOnMarketplace(uint256 ticketId) public view returns (address) {
        return marketplaceTickets[ticketId];
    }

    // function approveByOwner(address to, uint256 ticketId) public {
    //     // address owner = ownerOf(ticketId);
    //     // require(to != owner, "ERC721: approval to current owner");
    //     // require(
    //     //     to == ticketContractOwner,
    //     //     "ERC721: approve caller is not contract owner"
    //     // );
    //     require(
    //       ticketApprovals[ticketId] == to, "exist"
    //     );
    //     ticketApprovals[ticketId] = to;
    //     // emit Approval(owner, ticketContractOwner, ticketId);
    // }

    // function getTicketApproved(uint256 ticketId) public view returns (address) {
    //     // require(
    //     //     _exists(ticketId),
    //     //     "ERC721: approved query for nonexistent token"
    //     // );

    //     return ticketApprovals[ticketId];
    // }
}
