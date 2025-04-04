// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;


import{Test,console} from "forge-std/Test.sol";
import{IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import{EventFactory} from "../src/EventFactory.sol";
import{Event} from "../src/Event.sol";
import{FeeAddress} from "../src/FeeAddress.sol";
import{USDCMock} from "../src/mocks/USDCMock.sol";
import{Deployments} from "../script/Deployments.s.sol";
contract EventTests is Test{
    EventFactory factory;
    address feeAddress;
    address usdc;
    Event event1;

    uint256 owner=uint256(keccak256("owner private key"));
    address ownerAddress=vm.addr(owner);
    address user = makeAddr("user");
    address user2=makeAddr("user2");
    address user3=makeAddr("user3");

    function setUp() external{
        Deployments deployer=new Deployments();
        (factory,feeAddress,usdc)=deployer.run();
        vm.prank(address(deployer));
        // IERC20(usdc).mint(user,100e6);
        // usdc.mint(user2,100e6);
        // usdc.mint(user3,100e6);
        // console.log(usdc.balanceOf(user));
    }

    modifier EventCreated(){
        vm.prank(ownerAddress);
        event1=new Event("Will bitcoin hit $85000 on march 15?",block.timestamp+ 2 days,ownerAddress,address(usdc),address(feeAddress));
        _;
    }

    modifier BetPlaced() {
        vm.startPrank(user);
        usdc.approve(address(event1), 100e6);
        event1.placeBet(true,70e6);
        vm.stopPrank();
        _;
    }

    modifier BetsPlaced(){
       vm.startPrank(user);
       usdc.approve(address(event1), 100e6);
       event1.placeBet(true,50e6);
       vm.stopPrank();
       vm.startPrank(user2);
       usdc.approve(address(event1), 100e6);
       event1.placeBet(true,30e6);
       vm.stopPrank();
       vm.startPrank(user3);
       usdc.approve(address(event1), 100e6);
       event1.placeBet(false,70e6);
       vm.stopPrank();
       _;
    }

    //script contract is the owner
    function test_UserCannotCreateEvent() external{
        vm.startPrank(user);
        vm.expectRevert();
        factory.createEvent("Will bitcoin hit $85000 on march 15?", uint(block.timestamp)+2 days);
        vm.stopPrank();
    }

    function test_placeBetsDoesntWorkWithoutApproval() external EventCreated(){
        vm.prank(user);
        vm.expectRevert();
        Event(event1).placeBet(true, 70e6);
    }

    function test_placeBetsWorksWithApproval() external EventCreated(){
        console.log("USDCMock Address in Test:", address(usdc));
        console.log("USDC Address in Event:", address(event1.usdc()));

        vm.startPrank(user);
        usdc.approve(address(event1), 70e6);
        event1.placeBet(true, 70e6);
        vm.stopPrank();
    }

    function test_cantPlaceBetAfterDeadline() external EventCreated(){
        uint256 newTime=uint256(block.timestamp+1)+2 days;
        vm.warp(newTime);
        
        vm.startPrank(user);
        usdc.approve(address(event1), 70e6);
        vm.expectRevert();
        event1.placeBet(true, 70e6);
        vm.stopPrank();
    }

    function test_cantStakeZeroAmount() external EventCreated(){
        vm.startPrank(user);
        usdc.approve(address(event1), 70e6);
        vm.expectRevert();
        event1.placeBet(true, 0);
        vm.stopPrank();
    }

    function test_cantResolveEventBeforeDeadline() external EventCreated(){
        vm.startPrank(ownerAddress);
        vm.expectRevert();
        event1.resolveEvent(true);
        vm.stopPrank();
    }

    function test_cantClaimRewardsWithoutBeingEventIsResolved() external EventCreated() BetPlaced(){
        vm.startPrank(user);
        uint256 newTime=uint256(block.timestamp+1)+4 days;
        vm.warp(newTime);
        //the deadline has passed
        vm.expectRevert();
        event1.claimRewards();
        
        vm.stopPrank();
    }

    function test_cantChangeTheResolvedStateByCallingTheFunctionAgain() external EventCreated(){
        vm.startPrank(ownerAddress);
        uint256 newTime=uint256(block.timestamp+1)+4 days;
        vm.warp(newTime);
        //the deadline has passed
        event1.resolveEvent(false);
        vm.expectRevert();
        event1.resolveEvent(true);
        vm.stopPrank();
    }

    //the deadline passed and event resolved
    function test_canClaimRewardsAfterResolvedAndDeadlinePassed() external EventCreated() BetPlaced() {
        uint256 beforeBalance=usdc.balanceOf(user);
        uint256 betAmount=70e6;
        uint256 newTime=uint256(block.timestamp+1)+4 days;
        vm.warp(newTime);
        vm.prank(ownerAddress);
        event1.resolveEvent(true);
        vm.startPrank(user);
        event1.claimRewards();
        vm.stopPrank();
        assertEq(usdc.balanceOf(user),beforeBalance+betAmount);
    }

    function test_isRewardsDistributedProportionally() external EventCreated() BetsPlaced(){
        uint256 beforeBalance1=usdc.balanceOf(user);
        uint256 betAmount1=50e6;
        uint256 beforeBalance2=usdc.balanceOf(user2);
        uint256 betAmount2=30e6;
        uint256 beforeBalance3=usdc.balanceOf(user3);
        uint256 betAmount3=70e6;
        uint256 newTime=uint256(block.timestamp+1)+4 days;
        vm.warp(newTime);
        vm.prank(ownerAddress);
        event1.resolveEvent(true);
        vm.prank(user);
        event1.claimRewards();
        vm.prank(user2);
        event1.claimRewards();
        //as user3 has a wrong prediction he can't claim rewards
        vm.expectRevert();
        vm.prank(user3);
        event1.claimRewards();
        assertEq(usdc.balanceOf(user),1415625e2);
        assertEq(usdc.balanceOf(user2),1249375e2);
        //staked 80e6 usd remaining = 100 -80 =20
        assertEq(usdc.balanceOf(user3),30e6);
        assertEq(usdc.balanceOf(event1.protocolFeeReceiver()),35e5);
    }

    function test_canRequestRefundIfEventNotResolvedAfterFiveDays() external EventCreated() BetsPlaced(){
        uint256 beforeBalance1=usdc.balanceOf(user);
        uint256 betAmount1=50e6;
        uint256 beforeBalance2=usdc.balanceOf(user2);
        uint256 betAmount2=30e6;
        uint256 beforeBalance3=usdc.balanceOf(user3);
        uint256 betAmount3=70e6;
        //deadline = currentTime + 2days 
        //condition : the event is not resolved within the 5 days after deadline
        //so after (currenTime + 2 + 5) days we can refundStake
        uint256 newTime=uint256(block.timestamp)+7 days;
        vm.warp(newTime);

        vm.prank(user);
        event1.refundStake();
        vm.prank(user2);
        event1.refundStake();
        vm.prank(user3);
        event1.refundStake();

        assertEq(usdc.balanceOf(user),100e6);
        assertEq(usdc.balanceOf(user2),100e6);
        //staked 80e6 usd remaining = 100 -80 =20
        assertEq(usdc.balanceOf(user3),100e6);
    }
}