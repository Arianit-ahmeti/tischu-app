# Tischu App

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd tischu
```

### 2. Environment Setup

Create a `.env` file in the root directory with your Supabase credentials:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### 3. Start Development Environment

Launch the Docker development environment:

```bash
docker compose up
```

This will:

- Start the Expo development server
- Install all dependencies
- Make the app available on your network

### 4. Connect Your Mobile Device

1. Open the **Expo Go** app on your phone
2. Scan the QR code displayed in your terminal
3. The app will load on your device

### 5. Running Tests

To run the unit tests for the application:

```bash
npm test
```

To run headed (a browser window is opened where the testing sequence plays out) end-to-end tests:

```bash
npm run test:e2e:headed
```
