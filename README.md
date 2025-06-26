# AlgoMingle - Decentralized Messaging on Algorand

The main Android application for AlgoMingle, a decentralized messaging platform built on Algorand blockchain.

## Overview

AlgoMingle provides secure, decentralized messaging with features including:
- End-to-end encrypted messages
- Decentralized user identity
- Group messaging capabilities
- AI-powered content moderation
- Wallet integration (Pera, AlgoSigner, WalletConnect)

## Tech Stack

- **Framework**: React Native 0.72.7
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: Zustand
- **Blockchain Integration**: Algorand SDK
- **Testing**: Jest, React Native Testing Library

## Project Structure

```
algomingle/
├── src/
│   ├── components/     # React Native components
│   ├── screens/        # App screens
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── services/       # API and blockchain services
│   └── types/          # TypeScript type definitions
├── android/            # Android native code
├── __tests__/          # Test suites
└── package.json        # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Android Studio and Android SDK
- Java JDK 11 or higher
- React Native development environment set up
- Algorand wallet for testing

### Installation

```bash
# Clone the repository
git clone https://github.com/fbratten/algomingle.git
cd algomingle

# Install dependencies
npm install
# or
yarn install

# Install iOS pods (if building for iOS in future)
cd ios && pod install && cd ..

# Copy environment template
cp .env.example .env
# Edit .env with your configuration
```

### Development

```bash
# Start Metro bundler
npm start
# or
yarn start

# Run on Android device/emulator
npm run android
# or
yarn android

# Run tests
npm test
# or
yarn test

# Build release APK
cd android && ./gradlew assembleRelease
```

## Configuration

Key environment variables:
```env
ALGOD_URL=https://testnet-api.algonode.cloud
INDEXER_URL=https://testnet-idx.algonode.cloud
AI_ORCHESTRATOR_URL=http://localhost:8080
```

## Related Repositories

This is part of the AlgoMingle multi-repository project:
- [algorand-contracts-am](https://github.com/fbratten/algorand-contracts-am) - Smart contracts
- [ai-orchestrator-am](https://github.com/fbratten/ai-orchestrator-am) - AI services
- [devops-automation-am](https://github.com/fbratten/devops-automation-am) - CI/CD automation
- [development-playbook-am](https://github.com/fbratten/development-playbook-am) - Documentation

---

## 🚧 Project Status

This repository is part of an active development project and is **not currently accepting external contributions**.

- ✅ Feel free to **explore, fork, and learn** from the code
- 💬 **Questions?** Please use the [Discussions](../../discussions) tab
- ⭐ **Like the project?** Give it a star!
- 📧 **Private inquiries:** jack.bratten@adaptivearts.ai

For more information, see [CONTRIBUTING.md](CONTRIBUTING.md).
