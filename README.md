# MatkaCalc: AI-Powered Matka Game Assistant

MatkaCalc is a modern, mobile-first web application designed to assist users in playing and analyzing Matka games. It provides AI-powered number predictions, historical chart analysis, game results, and a seamless interface for placing bids and managing funds.

## Features

- **Dashboard**: A central hub to view all available games, their open/close times, and current status.
- **AI Number Predictions**: Leverages a proprietary algorithm to generate number predictions, helping users make informed decisions.
- **Historical Charts**: Visual charts and recent results to analyze past trends and number patterns for various games.
- **Place Bids**: An intuitive interface to place bets on various game types, including Single (Ank), Jodi, Patti, Half Sangam, and Full Sangam.
- **Wallet Management**: Easily deposit and withdraw funds.
- **Transaction History (Passbook)**: A clear log of all your transactions, including bets, winnings, deposits, and withdrawals.
- **Bidding History**: Track all your past bids and filter them by game, date, or status (Win/Loss/Pending).
- **Game Information**: Detailed sections for game rules, payout rates, and responsible gambling guidelines.
- **Responsive Design**: A mobile-first interface that provides a seamless experience on any device.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI/ML**: [Genkit (Firebase Genkit)](https://firebase.google.com/docs/genkit)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://your-repository-url.com
    cd your-project-directory
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add any necessary environment variables (e.g., API keys for Genkit).

    ```env
    # Example for Google AI with Genkit
    GEMINI_API_KEY=your_api_key_here
    ```

### Running the Development Server

You can run the application in development mode with hot-reloading:

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

## Project Structure

The project follows the standard Next.js App Router structure.

```
src
├── ai                  # Genkit AI flows and configuration
├── app                 # Main application routes and pages
│   ├── (app)           # Authenticated user routes
│   └── (auth)          # Authentication routes (login, signup)
├── components          # Reusable UI components
│   ├── layout          # Layout components (Header, BottomNav, etc.)
│   └── ui              # ShadCN UI components
├── hooks               # Custom React hooks
├── lib                 # Utility functions, data, types, and state management
└── public              # Static assets
```

## AI Features with Genkit

The application uses **Genkit** to power its AI features. The core AI logic is located in the `src/ai/flows` directory.

- **`generate-number-predictions.ts`**: This flow takes a game type and optional past results as input and returns AI-generated number predictions with a confidence score.
- **`display-historical-charts.ts`**: This flow is designed to generate data for visualizing historical game trends, although it currently returns mock data.

To run the Genkit development server for testing flows, use:

```bash
npm run genkit:watch
```
