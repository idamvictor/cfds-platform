# CFDS Trading Platform

A modern, full-featured trading platform for Contract for Differences (CFDs) built with React, TypeScript, and Vite. This platform provides real-time trading capabilities, account management, live support, and comprehensive financial tools.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

- 💹 Real-time Trading Dashboard

  - Live price updates via WebSocket
  - Trading charts and analysis tools
  - Order management system
  - Account balance and PnL tracking

- 🔐 Secure Authentication

  - Email-based login
  - Two-factor authentication (OTP)
  - Session management
  - Auto-login capability

- 💬 Live Support

  - Real-time chat with support staff
  - File sharing capabilities
  - Message history
  - Notification system

- 💰 Financial Management

  - Multiple account types
  - Deposit and withdrawal system
  - Inter-account transfers
  - Savings accounts
  - Transaction history

- 🌐 User Experience
  - Responsive design
  - Dark/Light mode
  - Multi-language support
  - Currency preferences
  - Sound notifications

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **UI Components**: Custom components with Tailwind CSS
- **Real-time Communication**: Pusher / WebSocket
- **HTTP Client**: Axios
- **Authentication**: JWT with OTP support

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Modern web browser

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url
VITE_PUSHER_APP_KEY=your_pusher_key
VITE_PUSHER_APP_CLUSTER=your_pusher_cluster
VITE_MAX_UPLOAD_SIZE=maximum_upload_size
```

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd cfds-platform
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Application pages/routes
├── store/            # Zustand state management
├── hooks/            # Custom React hooks
├── services/         # API and external services
├── types/            # TypeScript type definitions
├── lib/              # Utility functions
└── assets/          # Static assets
```

## Key Components

- `TradingDashboard`: Main trading interface with real-time updates
- `LiveChat`: Customer support system
- `AccountSection`: User account management
- `WebSocketInitializer`: Real-time data connection handler
- `AuthProvider`: Authentication state management

## Features in Detail

### Trading System

- Real-time price updates
- Multiple order types
- Risk management tools
- Trading history
- Performance analytics

### Account Management

- Multiple account types
- Balance tracking
- Deposit/Withdrawal system
- Transaction history
- Account verification

### Security Features

- Two-factor authentication
- Session management
- Secure API communication
- Input validation
- Rate limiting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚠️ Important Notice

Trading CFDs carries a high level of risk to your capital and you should only trade with money you can afford to lose. These products may not be suitable for all investors, therefore ensure you understand the risks involved and seek independent advice if necessary.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact support@example.com
