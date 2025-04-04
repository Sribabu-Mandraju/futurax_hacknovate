// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Event} from "./Event.sol";

/**
 * Tests are done in local chain 'Anvil'
 * 
 * To run tests, make this changes
 * 
 * 1.Deploy mockUSDC to anvil
 * 2.update the usdc address to this
 * 3.run tests
 */
contract EventFactory {
    address public owner;
    address public feeAddress;
    address public immutable usdc;
    address[] public createdEvents;

    event EventCreated(
        address indexed eventAddress,
        string description,
        uint deadline
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address _feeAddress,address _usdc) {
        owner = msg.sender;
        feeAddress=_feeAddress;
        usdc=_usdc;
    }

    function createEvent(
        string memory _description,
        string memory _imageUrl,
        uint _deadline
        
    ) external onlyOwner {
        Event newEvent = new Event(
            _description,
            _imageUrl,
            _deadline,
            msg.sender,
            usdc,
            feeAddress
        );
        createdEvents.push(address(newEvent));

        emit EventCreated(address(newEvent), _description, _deadline);
    }

    function updateFeeAddress(address protcolFeeAddress) external onlyOwner{
        require(feeAddress!=address(0),"Zero address");
        feeAddress=protcolFeeAddress;
    }

    function getDeployedEvents() external view returns (address[] memory) {
        return createdEvents;
    }
}
