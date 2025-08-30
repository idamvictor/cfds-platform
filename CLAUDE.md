# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production (runs TypeScript compiler first, then Vite build)
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

## Architecture Overview

This is a React + TypeScript CFD (Contract for Difference) trading platform built with:

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand with persistence middleware
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS v4 with CSS variables
- **Real-time Data**: WebSocket connections, Pusher, and Laravel Echo
- **HTTP Client**: Axios with custom instance configuration
- **Routing**: React Router DOM v7
- **Charts**: Recharts for data visualization, TradingView widgets for trading charts
- **Forms**: React Hook Form with Zod validation

## Key Store Architecture

The application uses Zustand stores for state management with persistence:

- `assetStore.ts` - Manages trading assets, active pairs, WebSocket updates, leverage calculations
- `siteSettingsStore.ts` - Site configuration, branding, feature flags (MT4 mode, marketplace, verification requirements)
- `userStore.ts` - User authentication and profile data
- `tradeStore.ts` - Trading positions and order management
- `dataStore.ts` - Market data and asset categories
- Additional stores: currency, marketplace, savings, sound, watchlist, overlay, online status

## Component Structure

- `components/ui/` - Reusable shadcn/ui components
- `components/trading/` - Trading interface components and panels
- `components/mt4/` - MetaTrader 4 interface components
- `layouts/` - Page layout components (MainLayout, MT4Layout, DepositLayout)
- `pages/` - Route components organized by feature area
- `hooks/` - Custom React hooks for WebSocket, mobile detection, currency handling

## Real-time Features

The platform implements real-time updates through:
- WebSocket connections for asset price updates
- Pusher integration for notifications and chat
- Laravel Echo for server-sent events
- Asset price updates are handled via `useAssetWebsocket` hook and `assetStore.updateAssetFromWebsocket`

## Trading Platform Features

- Multi-asset trading (forex, crypto, stocks, indices, commodities, metals)
- Real-time price feeds and charts
- Position management and order history
- Leverage calculation based on asset category and user account type
- Market watch functionality with customizable pairs
- Automated trading and algorithm trader components

## Key Configuration Files

- `components.json` - shadcn/ui configuration with New York style
- `tsconfig.*.json` - TypeScript configurations for app and Node.js
- `vite.config.ts` - Vite build configuration
- Path aliases: `@/` maps to `src/`

## Development Notes

- The platform supports both regular trading interface and MT4-style interface
- Site settings control branding, feature availability, and maintenance modes
- User verification requirements are configurable per site
- Marketplace feature can be enabled/disabled via site settings
- Sound effects are integrated throughout the UI with a dedicated sound store