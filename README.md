# Personal Finance Companion (React Native + Expo)

Personal Finance Companion is a mobile-first expense tracking application built with React Native and Expo. It helps users record transactions quickly, monitor savings goals, and understand spending trends through simple, actionable insights.

## Screenshots

| Home | Transactions | Insights | Goals |
|---|---|---|---|
| <img src="assets/previews/home.png" alt="Home" width="220" /> | <img src="assets/previews/transactions.png" alt="Transactions" width="220" /> | <img src="assets/previews/insights.png" alt="Insights" width="220" /> | <img src="assets/previews/goals.png" alt="Goals" width="220" /> |

## Table of Contents

- Project Overview
- Key Features
- Tech Stack
- Getting Started
- Running on Devices
- Build and Preview (EAS)
- Project Structure
- State and Data Handling
- Assumptions
- Known Limitations
- Troubleshooting
- Future Enhancements

## Project Overview

This project prioritizes product clarity and practical usability over feature overload. The app is designed for fast daily tracking and quick review of financial behavior.

Core user outcomes:
- Capture income and expense transactions
- Search and filter transaction history
- Edit and delete existing records
- Set and track monthly savings targets
- Understand patterns through weekly and monthly insights
- Receive contextual guidance using streak and coach messaging

## Key Features

### Home Dashboard
- Current balance overview
- Income and expense summary cards
- Savings progress bar
- Category breakdown and weekly trend charts
- Money coach message with tracking streak

### Transactions
- Add, edit, and delete transactions
- Search by amount, category, or notes
- Filter by type (`all`, `income`, `expense`)
- Sectioned list grouped as `Today`, `Yesterday`, and older dates
- Center floating add button in bottom navigation for quick entry

### Add/Edit Transaction
- Fields: amount, type, category, date, notes
- Native calendar picker for date selection
- Quick date shortcuts (`Today`, `Yesterday`)
- Inline validation and delete confirmation
- In-screen back action for accidental opens

### Goals
- Monthly savings target input
- Real-time progress visualization
- Saved vs target summary chips
- Motivation message based on progress state

### Insights
- Weekly comparison (`this week` vs `last week`)
- Highest spending category
- Category-wise expense visualization
- Monthly expense trend chart

## Tech Stack

- React Native (Expo SDK 54)
- JavaScript
- React Navigation (Bottom Tabs + Native Stack)
- Zustand for global state
- AsyncStorage for persistence
- react-native-chart-kit for charting
- @react-native-community/datetimepicker for native date selection

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation

```bash
npm install
```

### Start Development Server

```bash
npx expo start
```

## Running on Devices

From the Expo terminal, run on:
- Android emulator/device (`a`)
- iOS simulator/device (`i`)
- Web (`w`)
- Expo Go (scan QR)

Available npm scripts:

```bash
npm run start
npm run android
npm run ios
npm run web
```

## Build and Preview (EAS)

Build commands:

```bash
eas build -p android --profile preview-android
eas build -p ios --profile preview-ios-simulator
```

Latest Android preview:
- APK: https://expo.dev/artifacts/eas/i9ZChYQ7d8H8g52WCfn8qF.apk
- Logs: https://expo.dev/accounts/pawan1-tech/projects/ExoTra/builds/8aecd20c-6dbf-47c3-aa93-e8fdc6aba23b

Install via QR:

![Preview APK QR](https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https%3A%2F%2Fexpo.dev%2Fartifacts%2Feas%2Fi9ZChYQ7d8H8g52WCfn8qF.apk)

## Project Structure

```text
src/
  components/      Reusable UI components
  constants/       Theme tokens, spacing, categories
  navigation/      Bottom tab + stack navigation
  screens/         Home, Transactions, Add/Edit, Insights, Goals
  services/        Storage abstraction
  store/           Zustand state and actions
  utils/           Finance/date/format helpers
```

## State and Data Handling

- Local-first architecture using AsyncStorage
- Persisted Zustand store for transactions and goal state
- Explicit hydration handling with loading/error fallbacks
- Insight metrics are derived from local transaction data

## Assumptions

- Currency defaults to INR
- App is single-user and local-device focused
- No backend or authentication in current scope
- Insights are computed from locally stored transactions only

## Known Limitations

- No cloud sync or account login
- No recurring transaction automation
- No push reminders
- No CSV import/export

## Troubleshooting

### No development build installed error

If Expo reports missing development build, use one of these:
- Run with Expo Go: `npx expo start --go`
- Or install dev build: `eas build -p android --profile development`

### EAS profile missing error

If a profile is missing, ensure the same profile name exists in `eas.json` before running build commands.

### Date picker not appearing

Confirm dependency is installed:

```bash
npx expo install @react-native-community/datetimepicker
```

## Future Enhancements

- Recurring transaction templates
- Category budget limits
- CSV import/export
- Cloud sync and authentication
