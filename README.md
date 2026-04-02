# Personal Finance Companion (React Native + Expo)

A mobile-first personal finance app to help users track transactions, understand spending behavior, and stay motivated with savings goals.

## Project Overview

This project focuses on practical product thinking and UX clarity over complexity.

The app allows users to:
- Track income and expense transactions
- Search and filter transaction history
- Set and monitor a monthly savings goal
- View insights like category spending, weekly comparisons, and trends
- Get lightweight guidance through a Money Coach message and tracking streak

## Tech Stack

- Framework: React Native (Expo)
- Language: JavaScript
- Navigation: @react-navigation/native + bottom tabs + native stack
- State Management: Zustand
- Persistence: AsyncStorage
- Charts: react-native-chart-kit

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- Expo CLI (via npx, no global install required)

### Installation

```bash
npm install
```

### Run the App

```bash
npx expo start
```

Then open in:
- iOS Simulator
- Android Emulator
- Expo Go app on device
- Web (press w in Expo terminal)

### Build Check (Optional)

```bash
npx expo export --platform web
```

## Project Structure

```text
src/
  components/      Reusable UI components
  constants/       Theme colors, spacing, categories
  navigation/      Tab + stack navigation setup
  screens/         Home, Transactions, Add/Edit, Insights, Goals
  services/        Storage abstraction layer
  store/           Zustand global state + persistence
  utils/           Finance/date/formatter helper functions
```

## Feature Walkthrough

### 1) Home Dashboard

Purpose: Fast understanding of current financial health.

Includes:
- Current balance
- Total income
- Total expenses
- Savings goal progress
- Category breakdown chart
- Weekly spending trend chart
- Money Coach summary + tracking streak

### 2) Transaction Tracking

Users can:
- Add transaction
- View transaction history
- Edit transaction
- Delete transaction
- Search and filter transactions

Transaction fields:
- Amount
- Type (income/expense)
- Category
- Date
- Notes

UX details:
- Inline validation in add/edit form
- Quick date helpers (Today/Yesterday)
- Delete confirmation dialog
- Long notes truncated safely in list items

### 3) Goal / Challenge Feature

Implemented:
- Monthly savings goal
- Real-time progress indicator
- Motivational progress messaging
- Tracking streak integrated into coaching context

### 4) Insights Screen

Includes:
- Spending by category
- Weekly vs last week comparison
- Highest spending category
- Monthly expense trend
- Tracking streak context

### 5) Mobile UX Quality

Implemented:
- Bottom tab navigation (Home, Transactions, Insights, Goals)
- Modal add/edit flow
- Empty states
- Loading states
- Error states for hydration issues
- Touch-friendly controls and spacing
- Safe area handling for notch/status regions
- Responsive max-width layout for larger devices

### 6) Data Handling

Approach:
- Local-first app using AsyncStorage
- Zustand persist middleware stores:
  - transactions
  - goal state

Behavior:
- Data persists across app restarts
- Hydration state handled in global store
- Hydration error fallback displayed in UI

### 7) Code Structure and State Management

Engineering approach:
- UI is split into reusable components and screen-level containers
- Business logic is moved to utility helpers (finance/date/formatters)
- Global state and mutations centralized in Zustand store
- Storage implementation abstracted behind service layer

## Assumptions

- Currency is INR by default.
- Date entry uses YYYY-MM-DD format.
- Single-user local device usage; no cloud sync or auth.
- Insights are computed from locally saved transactions only.
- Notes are optional and capped for better mobile readability.

## Product Decisions

- Prioritized clarity and speed of entry over advanced accounting features.
- Kept data model intentionally simple for maintainability.
- Added a lightweight coaching signal to increase engagement without overengineering.

## Known Limitations

- No server sync or multi-device backup.
- No recurring transaction automation.
- No advanced budgeting envelopes.
- No push reminders/notifications in current scope.

## Evaluation Criteria Coverage

This implementation is designed to satisfy:
- Product thinking
- Mobile UI/UX quality
- Creativity (goal + streak + coach)
- Functionality (CRUD + filters + charts)
- Code quality
- State/data handling
- Responsiveness and device experience

## Scripts

From package.json:

```bash
npm run start
npm run android
npm run ios
npm run web
```

## Future Enhancements

- Notification reminders for daily tracking
- CSV export/import
- Optional dark mode
- Budget limits per category
- Cloud sync and authentication
