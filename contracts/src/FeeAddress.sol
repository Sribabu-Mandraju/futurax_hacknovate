// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract FeeAddress{
    address owner;
    address constant usdc=0x5aAdFB43eF8dAF45DD80F4676345b7676f1D70e3;  //replace this
       
    constructor(){
        owner=msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender==owner,"Not Authorized");
        _;
    }
    function withdraw() external onlyOwner(){
        uint amount=ERC20(usdc).balanceOf(address(this));
        ERC20(usdc).transfer(payable(owner),amount);
    }
    receive() payable external{}
}