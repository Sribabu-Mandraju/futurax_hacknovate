// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Event {
    struct Bet {
        uint256 amount;
        bool choice;
    }

    address public immutable owner;
    address public immutable protocolFeeReceiver;
    string public description;
    string public imageUrl;
    uint256 public immutable deadline;
    bool public resolved;
    bool public winningOption;
    IERC20 public immutable usdc;

    uint256 public totalYesBets;
    uint256 public totalNoBets;
    uint256 public constant PROTOCOL_FEE_PERCENT = 5; // 5% Fee

    mapping(address => Bet) public bets;

    event BetPlaced(address indexed user, bool choice, uint256 amount);
    event EventResolved(bool winningOption);
    event RewardsClaimed(
        address indexed user,
        uint256 amount,
        uint256 protocolFee
    );
    event StakeRefunded(address indexed user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier beforeDeadline() {
        require(block.timestamp < deadline, "Betting closed");
        _;
    }

    modifier afterDeadline() {
        require(block.timestamp >= deadline, "Event not yet resolved");
        _;
    }

    constructor(
        string memory _description,
        string memory _imageUrl,
        uint256 _deadline,
        address _owner,
        address _usdc,
        address _protocolFeeReceiver
    ) {
        owner = _owner;
        protocolFeeReceiver = _protocolFeeReceiver; // protocol fee receiver
        description = _description;
        imageUrl=_imageUrl;
        deadline = _deadline;
        usdc=IERC20(_usdc);
    }

    function placeBet(bool _choice, uint256 _amount) external beforeDeadline {
        require(msg.sender != owner, "Owner cannot stake");
        require(bets[msg.sender].amount == 0, "Bet already placed");
        require(_amount > 0, "Zero amount");
        
        // Ensure user has approved USDC transfer
        require(usdc.allowance(msg.sender, address(this)) >= _amount, "USDC allowance too low"); 
        usdc.transferFrom(msg.sender, address(this), _amount);

        bets[msg.sender] = Bet(_amount, _choice);
        if (_choice) {
            totalYesBets += _amount;
        } else {
            totalNoBets += _amount;
        }

        emit BetPlaced(msg.sender, _choice, _amount);
    }

    function resolveEvent(
        bool _winningOption
    ) external onlyOwner afterDeadline {
        require(!resolved, "Event already resolved");
        resolved = true;
        winningOption = _winningOption;

        emit EventResolved(_winningOption);
    }

    function claimRewards() external afterDeadline {
        require(resolved, "Event is not resolved yet");

        Bet storage userBet = bets[msg.sender];
        require(userBet.amount > 0, "No valid bet");

        bool userChoice = userBet.choice;
        require(userChoice == winningOption, "Incorrect prediction..Better Luck Next Time..!");

        uint256 totalWinningPool = winningOption ? totalYesBets : totalNoBets;
        uint256 totalLosingPool = winningOption ? totalNoBets : totalYesBets;

        uint256 grossPayout = (userBet.amount *
            (totalWinningPool + totalLosingPool)) / totalWinningPool;
        uint256 fee = ((grossPayout - userBet.amount) * PROTOCOL_FEE_PERCENT) /
            100;
        uint256 netPayout = grossPayout - fee;

        delete bets[msg.sender];

        usdc.transfer(msg.sender, netPayout);
        usdc.transfer(protocolFeeReceiver, fee);

        emit RewardsClaimed(msg.sender, netPayout, fee);
    }

    function refundStake() external afterDeadline {
        require(!resolved, "Event already resolved");
        require(
            block.timestamp >= deadline + 5 days,
            "Refund period not started"
        );

        Bet storage userBet = bets[msg.sender];
        require(userBet.amount > 0, "No valid bet");

        uint256 refundAmount = userBet.amount;
        delete bets[msg.sender];

        usdc.transfer(msg.sender, refundAmount);
        emit StakeRefunded(msg.sender, refundAmount);
    }


    function getEventDetails()
        external
        view
        returns (string memory, uint256, bool, bool, uint256, uint256)
    {
        return (
            description,
            deadline,
            resolved,
            winningOption,
            totalYesBets,
            totalNoBets
        );
    }
}
