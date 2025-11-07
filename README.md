# Xero Connect - React Application

A React application that connects to Xero accounting software to manage and view accounting data.

## Features

1. **OAuth 2.0 Authentication** - Secure login workflow with Xero
2. **Accounts Management** - View and display chart of accounts
3. **Modern UI** - Clean and responsive user interface

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Xero Developer Account (get credentials from https://developer.xero.com/myapps)

## Installation

1. **Clone or navigate to the project directory**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Xero credentials:
   ```
   XERO_CLIENT_ID=your-client-id-here
   XERO_CLIENT_SECRET=your-client-secret-here
   XERO_REDIRECT_URI=http://localhost:3000/callback
   PORT=5000
   SESSION_SECRET=your-session-secret-change-this-in-production
   ```

4. **Configure Xero App**
   
   - Go to https://developer.xero.com/myapps
   - Create a new app or use an existing one
   - Set the redirect URI to: `http://localhost:3000/callback`
   - Copy the Client ID and Client Secret to your `.env` file

## Running the Application

### Option 1: Run both servers together (recommended)
```bash
npm run dev
```

### Option 2: Run servers separately

**Terminal 1 - Backend Server:**
```bash
npm run server
```

**Terminal 2 - React Frontend:**
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
xero-connect/
├── server/
│   ├── index.js          # Express server setup
│   └── routes/
│       └── xero.js       # Xero API routes
├── src/
│   ├── components/
│   │   ├── Login.js      # Login component
│   │   ├── Dashboard.js  # Main dashboard
│   │   ├── Accounts.js   # Accounts display component
│   │   └── Callback.js   # OAuth callback handler
│   ├── App.js            # Main app component
│   └── index.js          # React entry point
├── package.json
└── README.md
```

## API Endpoints

- `GET /api/xero/login` - Get Xero authorization URL
- `GET /api/xero/callback` - Handle OAuth callback
- `GET /api/xero/auth-status` - Check authentication status
- `GET /api/xero/accounts` - Get chart of accounts
- `POST /api/xero/logout` - Logout user

## Usage

1. Start the application
2. Click "Connect to Xero" on the login page
3. You'll be redirected to Xero to authorize the application
4. After authorization, you'll be redirected back to the dashboard
5. View your chart of accounts with balances and details

## Technologies Used

- **React** - Frontend framework
- **Express** - Backend server
- **xero-node** - Official Xero Node.js SDK
- **Axios** - HTTP client
- **React Router** - Routing

## Security Notes

- Never commit your `.env` file to version control
- Use HTTPS in production
- Store session secrets securely
- Consider using a database for token storage in production instead of sessions

## Troubleshooting

### "Failed to initiate login"
- Make sure the backend server is running on port 5000
- Check that your Xero credentials in `.env` are correct
- Verify the redirect URI matches your Xero app configuration

### "Failed to fetch accounts"
- Ensure you're authenticated (check auth status)
- Verify your Xero app has the required scopes
- Check server logs for detailed error messages

## License

MIT

