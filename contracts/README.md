# 🏆 Decentralized Prediction Markets

## Overview
This project implements a **decentralized prediction market** platform where users can stake **USDC** on the outcomes of various events. The system uses smart contracts to allow an admin to create events, users to place bets on "Yes" or "No" outcomes, and ensures fair resolution and reward distribution.

## Features
- ✅ **Event Creation**: Admin creates events with descriptions, images, and deadlines
- ✅ **Decentralized Predictions**: Users stake USDC on binary outcomes (Yes/No)
- ✅ **Fair Resolution**: Admin resolves events after deadline passes
- ✅ **Automated Reward Distribution**: Winners receive proportional rewards
- ✅ **Protocol Fee**: 5% fee taken from winnings for protocol sustainability
- ✅ **Safety Mechanisms**: Users can withdraw stakes if events aren't resolved within 5 days
- ✅ **Anti-Manipulation**: Owner cannot participate in betting

## Smart Contracts

### `EventFactory.sol`
The factory contract that:
- Deploys new prediction event contracts
- Tracks all created events
- Manages protocol fee destination
- Restricts event creation to owner

```solidity
function createEvent(
    string memory _description,
    string memory _imageUrl,
    uint _deadline
) external onlyOwner
```

### `Event.sol`
The core prediction event contract that:
- Manages individual betting events
- Handles user bets and stake tracking
- Calculates and distributes winnings
- Implements the safety refund mechanism
- Enforces protocol fees

Key functions:
```solidity
function placeBet(bool _choice, uint256 _amount) external beforeDeadline
function resolveEvent(bool _winningOption) external onlyOwner afterDeadline
function claimRewards() external afterDeadline
function refundStake() external afterDeadline
```

## Implementation Details

### Reward Calculation
When an event resolves:
1. Winners share the entire pool (both winning and losing stakes)
2. Rewards are proportional to the user's stake
3. A 5% protocol fee is taken from profits (not the original stake)

### Safety Features
- Time-based restrictions (before/after deadline)
- 5-day grace period for refunds if admin fails to resolve
- Owner exclusion from betting

## Deployment
Contracts have been deployed to the **Sepolia Testnet** using Foundry.

## Getting Started

### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Sepolia Testnet ETH (for gas)
- Testnet USDC

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd decentralized-prediction-markets
   ```

2. **Install dependencies**
   ```bash
   forge install
   ```

3. **Compile contracts**
   ```bash
   forge build
   ```

4. **Run tests**
   ```bash
   forge test
   ```

5. **Environment Setup**
   Create a `.env` file with the following:
   ```
   RPC_URL=your_rpc_url_here
   MY_ADDRESS=your_wallet_address_here
   PRIVATE_KEY=your_private_key_here
   ```

6. **Deploy contracts**
   ```bash
   forge script script/Deploy.s.sol --rpc-url <SEPOLIA_RPC_URL> --private-key <PRIVATE_KEY> --broadcast
   ```

## Admin Access for Jury Panel
If the **jury panel** wants admin access, they must deploy the contract themselves. After deploying, they should **replace the following values** in the frontend `.env` file:

```env
VITE_EVENT_FACTORY_ADDRESS=DEPLOYED EVENT FACTORY_ADDRESS
VITE_EVENT_FACTORY_OWNER_ADDRESS=owner wallet address which is used to deploy the contract
```

These addresses should be updated to reflect the newly deployed contract's **EventFactory** address and the **admin's wallet address** that deployed the contract.

## Usage Guide

### For Admins
1. **Create a new event**
   ```solidity
   // Through the EventFactory contract
   eventFactory.createEvent("Will ETH hit $5000 by April 2025?", "https://example.com/eth-image.jpg", 1718309400);
   ```

2. **Resolve an event after deadline**
   ```solidity
   // Through the specific Event contract
   event.resolveEvent(true); // Yes outcome wins
   ```

3. **Update protocol fee receiver**
   ```solidity
   eventFactory.updateFeeAddress(newFeeReceiver);
   ```

### For Users
1. **Place a bet**
   ```solidity
   // First approve USDC spending
   usdc.approve(eventAddress, 100 * 10**6); // 100 USDC
   
   // Then place the bet (true for Yes, false for No)
   event.placeBet(true, 100 * 10**6);
   ```

2. **Claim rewards after winning**
   ```solidity
   event.claimRewards();
   ```

3. **Request refund if event isn't resolved**
   ```solidity
   // Only available 5 days after deadline if admin hasn't resolved
   event.refundStake();
   ```

## License
This project is licensed under the MIT License.

