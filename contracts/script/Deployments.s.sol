// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;
 
import{Script,console} from "forge-std/Script.sol";
import{EventFactory} from "../src/EventFactory.sol";
//import{FeeAddress} from "../src/FeeAddress.sol";
//import{USDCMock} from "../src/mocks/USDCMock.sol";
contract Deployments is Script{
    EventFactory factory;
    address feeAddress=0xD03cBa7a8B0D9aB531172eA087d17f0741200d5b;
    address usdc=0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238;
    function run() external returns(EventFactory _factory,address _feeAddress,address _usdc){
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        factory=new EventFactory(feeAddress,usdc);
        vm.stopBroadcast();     
        console.log("Event factory address",address(factory));
        console.log("Event factory owner",factory.owner());
        console.log("Protocol fee address",factory.feeAddress());
        console.log("usdc address",factory.usdc());
        return(factory,feeAddress,usdc);
    }

    function getDeployedEvents() external{
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        address[] memory events=factory.getDeployedEvents();
        console.log("events size",events.length);
        vm.stopBroadcast();
    }
}