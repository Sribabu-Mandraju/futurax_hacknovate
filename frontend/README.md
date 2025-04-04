# FuturaX Frontend - Vite React Setup

## Introduction

FuturaX is a decentralized prediction market that enables users to place bets on real-world events using blockchain technology. The frontend of FuturaX is built using **Vite + React**, providing a fast, modern, and developer-friendly environment for seamless user interactions.

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v16+ recommended)
- **npm** or **yarn**
- **Git** (optional, for version control)

## Installation and Setup

Follow these steps to set up the frontend project locally:

### 1. Clone the Repository

```sh
git clone https://github.com/Sribabu-Mandraju/futureX.git
cd futureX
```

### 2. Install Dependencies

Using npm:

```sh
npm install
```

Using yarn:

```sh
yarn install
```

### 3. Start the Development Server

```sh
npm run dev
```

This will start a local server (default: `http://localhost:5173/`) where you can see the frontend in action.

Live Deployment


### 4. Build for Production

To generate an optimized build, run:

```sh
npm run build
```

This will create a `dist/` folder containing the production-ready frontend.

### 5. Preview Production Build

```sh
npm run preview
```

This allows you to preview the built files before deploying.

## Project Structure

```
📂 futurax-frontend
 ├── 📂 src
 │   ├── 📂 abis         # Deployed smart contract abis to interact with on-chain communication
 │   ├── 📂 config       # helper functionality for configuring to web3 or ether.js
 │   ├── 📂 components   # Reusable UI components
 │   ├── 📂 pages        # Page-specific components
 │   ├── 📂 hooks        # Custom React hooks
 │   ├── 📂 context      # Global state management
 │   ├── 📂 store        # for optimized state management
 │   ├── 📂 assets       # Images, icons, etc.
 │   ├── 📂 providers    # for global state management
 │   ├── App.jsx        # Root component
 │   ├── main.jsx       # Entry point
 │   └── index.css      # Global styles
 ├── 📜 package.json     # Project dependencies
 ├── 📜 vite.config.js   # Vite configuration
 ├── 📜 README.md        # Project documentation
 └── 📜 .gitignore       # Files to ignore in version control
```

## Features

🚀 **Fast & Efficient** – Built with Vite for lightning-fast development.  
🎨 **Modern UI** – Intuitive and user-friendly design for seamless interactions.  
🔗 **Web3 Wallet Integration** – Supports **MetaMask, WalletConnect, and other Web3 wallets**.  
📡 **Real-Time Data** – Fetches event results and updates user predictions dynamically.  
💰 **Smart Contract Interaction** – Communicates with blockchain for placing bets and receiving payouts.

## Deployment

To deploy the frontend on a hosting platform like **Vercel, Netlify, or AWS**, follow these general steps:

1. Build the project using `npm run build`
2. Upload the `dist/` folder to your preferred hosting provider
3. Configure domain settings if necessary

## Contributors

👨‍💻 **[Nandeesh (0x02Auditor)](https://twitter.com/0x02Auditor)** – Lead Developer  
🔗 **[Bhanu Teja](https://twitter.com/BhanuTeja)** – Full Stack Developer  
🎨 **[Sribabu (5r1b4bu)](https://twitter.com/5r1b4bu)** – Frontend Developer

---

### **Get Started with FuturaX!**

Ready to explore the decentralized prediction market? Set up your frontend today and start building the future of blockchain-powered predictions!

📌 **Website:** [FuturaX Official Site](https://future-x-ulpg.vercel.app)
