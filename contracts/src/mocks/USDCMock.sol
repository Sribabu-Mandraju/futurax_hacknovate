// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract USDCMock is ERC20, Ownable {
    uint8 private _decimals = 6; // USDC has 6 decimals

    constructor() ERC20("USD Coin", "USDC") Ownable(msg.sender) {
        // Mint initial supply to the contract deployer
        _mint(msg.sender, 1000000 * 10**_decimals); // 1 million USDC
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    // For testing purposes, allow anyone to mint tokens
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}